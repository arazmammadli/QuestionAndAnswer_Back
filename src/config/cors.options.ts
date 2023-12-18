
import {CorsOptions} from "cors";
import allowedOrigins from "@/config/allowed.origins";

export const corsOptions:CorsOptions = {
    origin:(origin:any,callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null,true)
        } else  {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials:true
};