import * as mongoose from "mongoose";
import * as process from "process";
import {ConnectOptions} from "mongoose";

export const connectDB = async () => {
    const DATABASE_URI = process.env?.DATABASE_URI || "";
    try {
        await mongoose.connect(DATABASE_URI);
    } catch (err) {
        console.error(err);
    }
};