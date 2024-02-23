import express, { Express } from 'express';
import dotenv from 'dotenv'
import connectDB from './utils/connectDb.js';
import cors from 'cors'
import jobPostRouter from './routes/jobPostRoute.js';
import companyRouter from './routes/company.js';
import status from 'express-status-monitor'
import session from 'express-session'
import passport from 'passport'
import candidateRouter from './routes/user/candidate.js';
import employerRouter from './routes/user/employer.js';
import jobAppRouter from './routes/jobApp.js';
import morgan from "morgan";
import controlledFieldRouter from './routes/controlledField.js';
import errorMiddleware from './middleware/error.js';
import adminRouter from './routes/user/adminRoute.js';
import http from 'http';
import { Server } from "socket.io";
import chatRouter from './routes/chat.js';
import cookieParser from 'cookie-parser';
import templateRouter from './routes/template.js';
import subscriptionRouter from './routes/subscription.js';
import paymentRouter from './routes/payment.js';
import emailTemplateRouter from './routes/emailTemplate.js';
import smtpConfigRouter from './routes/smtpConfig.js';
import backupRouter from './routes/backup.js';
import blogRouter from './routes/blog.js';
import couponRouter from './routes/coupon.js';
import cron from 'node-cron';
import weeklyEmailQueue from './queues/weeklyEmailNewsletter.js';

dotenv.config();

// initiating the app
const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
// socket IO
const candidateSockets: any = {};

const addNewUser = (mongoId: string, socketId: string) => {
  candidateSockets[mongoId] = socketId;
};

io.on("connection", (socket) => {
  console.log("some one has connected");
  // addNewUser(mongoId, socket.id);
  socket.on("newUser", (mongoId) => {
    console.log(mongoId, socket.id);
    addNewUser(mongoId, socket.id);
  });
  // sendNotification
  socket.on("sendNotification", ({ senderId, receiverId, data }) => {
    // console.log(candidateSockets[receiverId], receiverId);
    console.log(candidateSockets);
    console.log(receiverId);

    io.to(candidateSockets[receiverId]).emit("getNotification", {
      senderId,
      notification: data,
    });
  });
  // send message
  socket.on("sendMessage", ({ senderId, receiverId, data }) => {
    console.log(candidateSockets);

    io.to(candidateSockets[receiverId]).emit("getMessage", {
      senderId,
      message: data,
    });
  });

  socket.on("disconnect", () => {
    console.log("someone has left");
  });
});

// required middleware
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(status());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

cron.schedule('0 9 * * 1', () => {
  // console.log("running")
  weeklyEmailQueue.add({});
})
// routers
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/jobPost", jobPostRouter);
app.use("/api/v1/candidate", candidateRouter)
app.use("/api/v1/employer", employerRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/jobApp", jobAppRouter);
app.use("/api/v1/template", templateRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1", controlledFieldRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/emailTemplate", emailTemplateRouter);
app.use("/api/v1/smtpConfig", smtpConfigRouter);
app.use("/api/v1/backup", backupRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/getClientUrl", (req, res) => {
  res.send({
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000"
  })
})

// app.use("/", (req, res, next) => {
//   res.send("⚡️[server]: This is cyberLevel's server")
// })
app.use(errorMiddleware);

// const options = {
//   cert: fs.readFileSync('/etc/letsencrypt/live/layer2.fun/fullchain.pem'),
//   key: fs.readFileSync('/etc/letsencrypt/live/layer2.fun/privkey.pem')
// };

const port = process.env.PORT || 8000;
// const httpsPort = 443
const start = async () => {
  try {
    if (process.env.MONGO_URL) {
      await connectDB(process.env.MONGO_URL);
      server.listen(port, () =>
        console.log(
          `⚡️[server]: Server iS running at http://localhost:${port} as well as connected with database`
        )
      );
    }

    // server.listen(7000)
    // https.createServer(options, app).listen(httpsPort, () => {
    //   console.log(
    //     `⚡️[server]: Server is running on HTTPS at port ${httpsPort}`
    //   );
    // });

  } catch (error) {
    console.log(error);
  }
};
start();
