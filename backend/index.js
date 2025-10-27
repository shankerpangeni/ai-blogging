import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import {connectDb} from "./src/utils/connectDb.js";
import userRoutes from './src/routes/user.route.js';
import chatRoutes from './src/routes/chat.route.js';
import aiRoutes from './src/routes/interaction.route.js';

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}


const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials:true,
};

app.use(express.json());

app.use(cors(corsOptions));
app.use(cookieParser());

///user api here
app.use('/api/v1/user',userRoutes );
app.use('/api/v1/chat',chatRoutes);
app.use('/api/v1/interaction',aiRoutes);


app.listen(process.env.PORT || 3000 , () => {
    console.log("server is running at port ", process.env.PORT || 3000);
    connectDb();
});



