const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        await mongoose.connect(MONGO_URI, {

        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
module.exports = connectDB;