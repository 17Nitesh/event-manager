import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected to: ', connection.connection.host);
    } catch (error) {
        console.log('Error connecting to the database: ', error);
    }
}

export default dbConnect;