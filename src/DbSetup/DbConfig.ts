import mongoose, { connect } from "mongoose";
require('dotenv/config');

const DB_CONNECTION = process.env.DB_CONNECTION ?? 'Not Connect';

export const DBConnection = async () => {
    try {
        mongoose.set('strictQuery', false);
        await connect(DB_CONNECTION);
        console.log('db connected you can start storing data');
    } catch (err) {
        throw err;
    }
};