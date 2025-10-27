import mongoose from 'mongoose';

const connectDb = async(req , res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected Successfully.")
    } catch (error) {
        console.log(error);
    }
} 

export {connectDb};