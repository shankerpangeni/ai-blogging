import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    category : {
        type: String,
        enum: ['text', 'image' , 'code ', 'other'],
        default: 'text'

    },

    endpoint: {
        type: String,
        required: true,
    },

    icon: {
        type: String,
    }

}, {timestamps: true});

export const Service = mongoose.model('Service' , serviceSchema);