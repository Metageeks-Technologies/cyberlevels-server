import { Pinecone } from "@pinecone-database/pinecone";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable";
import { CharacterTextSplitter, RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import { combineDocuments, getChatLLM, getEmbeddings, getPineconeIndex } from "../utils/langchainHelper";
import axios from "axios";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { getUrlForDownloadPdf } from "../utils/uploadToS3";
import { NextFunction } from "express";
dotenv.config();



const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
const azureApiKey = process.env.AZURE_OPENAI_KEY || "";


export const newUploadToPc = catchAsyncError(async (req, res, next) => {

    const { candidateId } = req.body;

    // loading the document
    const path = `uploads/jesc105.pdf`
    const loader = new PDFLoader(path);
    const docs = await loader.load();

    // splitting the document into chunks
    const splitter = new RecursiveCharacterTextSplitter(
        {
            separators: ["\n\n", "\n", " ", ""],
            chunkSize: 500,
            chunkOverlap: 30
        }
    );
    const splittedDocs = await splitter.splitDocuments(docs);

    // reducing the docs to optimize cost on pinecone
    const reducedDocs = splittedDocs.map((doc) => {
        const reducedMetadata = { ...doc.metadata };
        delete reducedMetadata.pdf; // Remove the 'pdf' field
        return new Document({
            pageContent: doc.pageContent,
            metadata: reducedMetadata,
        });
    });

    // getting the required things
    const pineconeIndex = getPineconeIndex(next);
    const embeddings = getEmbeddings(next);
    if (!pineconeIndex || !embeddings) {
        return next(new ErrorHandler("some of required term not found", 500))
    }

    // inserting the embeddings to pinecone
    await PineconeStore.fromDocuments(
        reducedDocs,
        embeddings,
        {
            pineconeIndex,
            namespace: candidateId
        }
    );

    res.status(200).json({
        success: true,
        response: `Document inserted to pinecone successfully. The reduced chunk size is ${reducedDocs.length}.`
    })
}
)
export const newQueryToPc = catchAsyncError(async (req, res, next) => {

    const { candidateId, query } = req.query;
    const namespace = candidateId as string;
    const question = query as string;

    // get Required things
    const tokenUsage = { tokens: 0, totalTokenCount: 0 };
    const pineconeIndex = getPineconeIndex(next);
    const embeddings = getEmbeddings(next);
    const llm = getChatLLM(next, tokenUsage);


    if (!pineconeIndex || !embeddings || !llm) {
        return next(new ErrorHandler("some of required term not found", 500))
    }

    // setUp Retriever
    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        {
            pineconeIndex,
            namespace,
        }
    );
    const retriever = vectorStore.asRetriever();

    // setUp prompt Templates
    const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'
    // const answerTemplate = `You are a helpful and enthusiastic career counselor who can answer a given question about candidate resume based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." Don't try to make up an answer. Always speak as if you were chatting to a candidate who is looking for a job.
    //                         context: {context}
    //                         question: {question}
    //                         answer: `
    const answerTemplate = `You are a helpful and enthusiastic science teacher who can answer a given question about
    science based on the context provided. Try to find the answer in the context.
    If you really don't know the answer, say "I'm sorry, I don't know the answer to that."
    Don't try to make up an answer.
    Always speak as if you were chatting to a student who is curious about the science.
                            context: {context}
                            question: {question}
                            answer: `
    // setUp promptTemplate instance
    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

    // setUp the related chains
    const standaloneQuestionChain = standaloneQuestionPrompt
        .pipe(llm)
        .pipe(new StringOutputParser());

    const retrieverChain = RunnableSequence.from([
        prevResult => prevResult.standalone_question,
        retriever,
        combineDocuments
    ])
    const answerChain = answerPrompt
        .pipe(llm)
        .pipe(new StringOutputParser())

    // combine the related  chains to get output for a given input
    const chain = RunnableSequence.from([
        {
            standalone_question: standaloneQuestionChain,
            original_input: new RunnablePassthrough(),

        },
        {
            context: retrieverChain,
            question: ({ original_input }) => original_input.question
        },
        answerChain
    ])

    // invoking the combined chain to get response
    const response = await chain.invoke({
        question
    });

    res.status(200).json({
        success: true,
        tokenUsage,
        response
    })
})

export const chatWithAiUsingRest = catchAsyncError(async (req, res, next) => {

    const { query } = req.query;
    if (!query) next(new ErrorHandler("Query not found", 404))

    const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Does Azure OpenAI support customer managed keys?" },
        { role: "assistant", content: "Yes, customer managed keys are supported by Azure OpenAI" },
        {
            role: "user",
            content: query
        },
    ];

    const { data } = await axios.post(endpoint, { messages }, {
        headers: {
            "Content-Type": "application/json",
            "api-key": `${azureApiKey}`
        }
    })

    res.send({ result: data });
}
)
export const uploadResumeToPinecone = catchAsyncError(async (req, res, next) => {

    if (!req.file) {
        return next(new ErrorHandler("file not found", 400));
    }

    const file = req.file;
    const { candidateId } = JSON.parse(req.body.metadata);
    console.log(candidateId);

    const bookPath = `uploads/${file.originalname}`

    const loader = new PDFLoader(bookPath);

    const docs = await loader.load();


    if (!docs || docs.length === 0) {
        console.log("No documents found.");
        return;
    }

    const splitter = new CharacterTextSplitter({
        separator: " ",
        chunkSize: 250,
        chunkOverlap: 25,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    const reducedDocs = splitDocs.map((doc) => {
        const reducedMetadata = { ...doc.metadata };
        delete reducedMetadata.pdf; // Remove the 'pdf' field
        return new Document({
            pageContent: doc.pageContent,
            metadata: reducedMetadata,
        });
    });

    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) {
        return next(new ErrorHandler("PINECONE_ENVIRONMENT apiKey or environment not found name not found", 400));
    }

    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
    });
    // console.log(client);
    if (!process.env.PINECONE_INDEX) {
        return next(new ErrorHandler("index name not found", 400));
    }
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);


    const embeddings = new OpenAIEmbeddings({
        azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
        azureOpenAIApiVersion: "2023-05-15", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
        azureOpenAIApiInstanceName: "cyberlevels", // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
        azureOpenAIApiDeploymentName: "cyberlevels-resume", // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
    });

    const result = await PineconeStore.fromDocuments(
        reducedDocs,
        embeddings,
        {
            pineconeIndex,
            namespace: candidateId,
        }
    );

    console.log("Successfully uploaded to DB");
    // Modify output as needed
    res.status(200).json({
        response: result,
        fileName: file.originalname,
        result: `Uploaded to Pinecone! Before splitting: ${docs.length}, After splitting: ${splitDocs.length}`,
    });


})
export const queryToPinecone = catchAsyncError(async (req, res, next) => {


    const { query: input, candidateId } = req.query;

    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) {
        return next(new ErrorHandler("PINECONE_ENVIRONMENT apiKey or environment not found name not found", 400));
    }

    const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:';
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);


    const prompt = PromptTemplate.fromTemplate(
        `you are a career counselor, based on candidate given resume resolve his query "{candidateQuery}". each point should be in a new line`
    );

    const formattedPrompt = await prompt.format({
        candidateQuery: input,
    });

    console.log("promt is", prompt);


    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
    });

    if (!process.env.PINECONE_INDEX) {
        return next(new ErrorHandler("index name not found", 400));
    }
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
    // const namespace = req.params.email;

    const embeddings = new OpenAIEmbeddings({
        azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
        azureOpenAIApiVersion: "2023-05-15",
        azureOpenAIApiInstanceName: "cyberlevels",
        azureOpenAIApiDeploymentName: "cyberlevels-resume",
    });



    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        { pineconeIndex, namespace: candidateId as string },

    );
    const model = new OpenAI({
        temperature: 1, azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
        azureOpenAIApiVersion: "2023-05-15",
        azureOpenAIApiInstanceName: "cyberlevels",
        azureOpenAIApiDeploymentName: "cyberlevels",
    });



    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const response = await chain.call({ query: formattedPrompt });


    // Modify output as needed
    // console.log(response);
    return res.status(200).json({
        response: response,

    });


})
export const query = catchAsyncError(async (req, res, next) => {


    const llm = new ChatOpenAI({
        temperature: 1, azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
        azureOpenAIApiVersion: "2023-05-15",
        azureOpenAIApiInstanceName: "cyberlevels",
        azureOpenAIApiDeploymentName: "cyberlevels",
    })
    const embeddings = new OpenAIEmbeddings({
        azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
        azureOpenAIApiVersion: "2023-05-15",
        azureOpenAIApiInstanceName: "cyberlevels",
        azureOpenAIApiDeploymentName: "cyberlevels-resume",
    });
    const punctuationTemplate = `Given a sentence, add punctuation where needed. sentence : {sentence} sentence with punctuation:`

    const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);

    const grammarTemplate = `Given a sentence correct the grammar. sentence : {punctuated_sentence} sentence with correct grammar:`;
    const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate);

    const translationTemplate = `Given a sentence, translate that sentence into {language}. sentence :{grammatically_correct_sentence} translated sentence:`

    const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);

    const chain = RunnableSequence.from([

        punctuationPrompt,
        llm,
        new StringOutputParser(),
        { punctuated_sentence: prevResult => prevResult },
        grammarPrompt,
        llm,
        new StringOutputParser()
    ])

    const response = await chain.invoke({
        sentence: "i dont liked mondays",
        language: 'french',
    })

    return res.status(200).json({
        response: response

    });

})
// export const query = catchAsyncError(async (req, res, next) => {

//     if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) {
//         return next(new ErrorHandler("PINECONE_ENVIRONMENT apiKey or environment not found name not found", 400));
//     }
//     if (!process.env.PINECONE_INDEX) {
//         return next(new ErrorHandler("index name not found", 400));
//     }

//     const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:';
//     const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

//     const llm = new ChatOpenAI({
//         temperature: 1, azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
//         azureOpenAIApiVersion: "2023-05-15",
//         azureOpenAIApiInstanceName: "cyberlevels",
//         azureOpenAIApiDeploymentName: "cyberlevels",
//     })
//     const pinecone = new Pinecone({
//         apiKey: process.env.PINECONE_API_KEY,
//         environment: process.env.PINECONE_ENVIRONMENT,
//     });
//     const embeddings = new OpenAIEmbeddings({
//         azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
//         azureOpenAIApiVersion: "2023-05-15",
//         azureOpenAIApiInstanceName: "cyberlevels",
//         azureOpenAIApiDeploymentName: "cyberlevels-resume",
//     });


//     const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
//     const vectorStore = await PineconeStore.fromExistingIndex(
//         embeddings,
//         { pineconeIndex, },

//     );
//     const retriever = vectorStore.asRetriever();
//     const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever);
//     const standaloneQuestionChainResponse = await standaloneQuestionChain.invoke({ question: "who is ms virat kohli" })

//     return res.status(200).json({
//         response: standaloneQuestionChainResponse

//     });

// })
export const deleteFromPinecone = catchAsyncError(async (req, res, next) => {


    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) {
        return next(new ErrorHandler("PINECONE_ENVIRONMENT apiKey or environment not found name not found", 400));
    }
    const { candidateId } = req.query;
    const namespace = candidateId as string;

    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
    });

    if (!process.env.PINECONE_INDEX) {
        return next(new ErrorHandler("index name not found", 400));
    }
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
    // await pineconeIndex.deleteAll();
    const ns = pineconeIndex.namespace(namespace);
    const response = await ns.deleteAll();

    res.status(200).json({
        message: "deleted successfully",
    });
})

const downloadResumeToServer = async (s3Key: string, filePath: string) => {

    const url = getUrlForDownloadPdf(s3Key)
    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, Buffer.from(response.data));
}
const uploadToPinecone = async (candidateId: string, filePath: string, next: NextFunction) => {

    // loading the document
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // splitting the document into chunks
    const splitter = new RecursiveCharacterTextSplitter(
        {
            separators: ["\n\n", "\n", " ", ""],
            chunkSize: 500,
            chunkOverlap: 30
        }
    );
    const splittedDocs = await splitter.splitDocuments(docs);

    // reducing the docs to optimize cost on pinecone
    const reducedDocs = splittedDocs.map((doc) => {
        const reducedMetadata = { ...doc.metadata };
        delete reducedMetadata.pdf; // Remove the 'pdf' field
        return new Document({
            pageContent: doc.pageContent,
            metadata: reducedMetadata,
        });
    });

    // getting the required things
    const pineconeIndex = getPineconeIndex(next);
    const embeddings = getEmbeddings(next);
    if (!pineconeIndex || !embeddings) {
        return next(new ErrorHandler("some of required term not found", 500))
    }

    // inserting the embeddings to pinecone
    await PineconeStore.fromDocuments(
        reducedDocs,
        embeddings,
        {
            pineconeIndex,
            namespace: candidateId
        }
    );
}
const queryToPc = async (namespace: string, question: string, next: NextFunction) => {

    // get Required things
    console.log(question);
    const tokenUsage = { tokens: 0, totalTokenCount: 0 };
    const pineconeIndex = getPineconeIndex(next);
    const embeddings = getEmbeddings(next);
    const llm = getChatLLM(next, tokenUsage);


    if (!pineconeIndex || !embeddings || !llm) {
        return next(new ErrorHandler("some of required term not found", 500))
    }

    // setUp Retriever
    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        {
            pineconeIndex,
            namespace,
        }
    );
    const retriever = vectorStore.asRetriever();

    // setUp prompt Templates
    const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'
    const answerTemplate = `You are a helpful and enthusiastic career counselor who can answer a given question about candidate resume based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." Don't try to make up an answer. Always speak as if you were chatting to a candidate who is looking for a job.
                            context: {context}
                            question: {question}
                            answer: `
    // const answerTemplate = `You are a helpful and enthusiastic science teacher who can answer a given question about
    // science based on the context provided. Try to find the answer in the context.
    // If you really don't know the answer, say "I'm sorry, I don't know the answer to that."
    // Don't try to make up an answer.
    // Always speak as if you were chatting to a student who is curious about the science.
    //                         context: {context}
    //                         question: {question}
    //                         answer: `
    // setUp promptTemplate instance
    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

    // setUp the related chains
    const standaloneQuestionChain = standaloneQuestionPrompt
        .pipe(llm)
        .pipe(new StringOutputParser());

    const retrieverChain = RunnableSequence.from([
        prevResult => prevResult.standalone_question,
        retriever,
        combineDocuments
    ])
    const answerChain = answerPrompt
        .pipe(llm)
        .pipe(new StringOutputParser())

    // combine the related  chains to get output for a given input
    const chain = RunnableSequence.from([
        {
            standalone_question: standaloneQuestionChain,
            original_input: new RunnablePassthrough(),

        },
        {
            context: retrieverChain,
            question: ({ original_input }) => original_input.question
        },
        answerChain
    ])

    // invoking the combined chain to get response
    const response = await chain.invoke({
        question
    });

    return { tokenUsage, response }
}
const deleteFromPc = async (namespace: string, next: NextFunction) => {

    const pineconeIndex = getPineconeIndex(next);
    if (pineconeIndex) {
        const ns = pineconeIndex.namespace(namespace);
        const response = await ns.deleteAll();
    }
}


export const getSuggestion = catchAsyncError(async (req, res, next) => {


    const s3Key = req.query.s3Key as string;
    const candidateId = req.query.candidateId as string;
    const question = req.query.question as string
    const resume = s3Key.split("/");
    const fileName = resume[resume.length - 1];
    const filePath = path.join(__dirname, "../..", 'uploads', fileName);

    await downloadResumeToServer(s3Key, filePath);
    await uploadToPinecone(candidateId, filePath, next);

    const response = await queryToPc(candidateId, question, next);

    // reset
    await deleteFromPc(candidateId, next);
    fs.unlink(filePath, (err: any) => {
        if (err) throw err;
        console.log('path/file.txt was deleted');
    });


    res.status(200).json({
        success: true,
        response
    })


})