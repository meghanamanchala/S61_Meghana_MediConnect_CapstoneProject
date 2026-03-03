const mongoose = require('mongoose')

require("dotenv").config()
const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
}

module.exports = connectDB;