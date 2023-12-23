import { Document } from "mongoose";



export interface IEmployerSub extends Document {
    subscriptionType: string;
    subscriptionFor: string;
    price: {
        amount: number;
        currency: {
            abbreviation: string;
            name: string;
            symbol: string;
        };
    };
    duration: string;
    offering: {
        [key: string]: unknown;
    }
}

export interface ICandidateSub extends Document {
    subscriptionType: string;
    subscriptionFor: string;
    price: {
        amount: number;
        currency: {
            abbreviation: string;
            name: string;
            symbol: string;
        };
    };
    duration: string;
    offering: {
        [key: string]: unknown;
    }
}