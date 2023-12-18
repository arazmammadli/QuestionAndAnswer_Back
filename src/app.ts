import express,{Application} from "express";
import Controller from "@/utils/interfaces/controller.interface";
import cors from "cors";
import {corsOptions} from "@/config/cors.options";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error.middleware";
import {connectDB} from "@/config/dbConnection";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";

class App {
    public express:Application;
    public port:number;

    constructor(controllers:Controller[],port:number) {
        this.port = port;
        this.express = express();

        this.initialiseCloudinaryConfig();
        this.useDatabaseConnection();
        this.useMiddleware();
        this.useControllers(controllers);
        this.useErrorHandling();
    };

    private initialiseCloudinaryConfig(): void {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    private useMiddleware():void {
        this.express.use(cors(corsOptions));
        this.express.use(express.json({limit:"10mb"}));
        this.express.use(cookieParser());
        this.express.use(express.urlencoded({extended:false}));
    };

    private useControllers(controllers:Controller[]) {
        controllers.forEach((controller:Controller) => {
            this.express.use("/api",controller.router)
        })
    };

    private useErrorHandling():void {
        this.express.use(ErrorMiddleware)
    };

    private async useDatabaseConnection():Promise<void> {
       try {
           await connectDB()
       } catch (err) {
           console.error("Database connection error:",err)
       }
    };

    public listen():void {
        mongoose.connection.once("open",() => {
            console.log("Connected to Mongo DB");
            this.express.listen(this.port,() => {
                console.log(`server running on ${this.port} port.`)
            })
        })
    }
};

export default App;