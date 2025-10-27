import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique:true,
        required: true,

    },

    password: {
        type: String,
        required: true,
    },

    phoneNumber: {
        type: String,
        required: true,
    },

    fullname:{
        type:String,
        required:true,
    },

    bio:{
        profie: {
            type: String,
            
        },

        description: {
            type: String,
        },

        summary: {
            type: String,
        }
    }


}, {timestamps:true});

export const User = mongoose.model("User" , userSchema);