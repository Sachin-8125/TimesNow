import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
    try {
        await mongoose.connect(env.mongoUri, {
            autoIndex: env.nodeEnv !== 'production'
        });
        console.log('Connnected to MONGODB');
    } catch (error) {
        console.error('Database Connection Failed: ', error);
        throw error;
    }
}