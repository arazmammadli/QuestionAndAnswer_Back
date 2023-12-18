import {NextFunction, Request, Response} from "express";
import HttpException from "@/utils/exceptions/http.exception";
import IToken from "@/utils/interfaces/token.interface";
import UserSchema from "@/models/user.schema";
import jwt from "jsonwebtoken";
import {verifyJwt} from "@/utils/token";

async function authenticatedMiddleware(
    req:Request,
    res:Response,
    next:NextFunction
):Promise<Response | void> {
    const bearer = req.headers.authorization;

    if(!bearer || !bearer.startsWith("Bearer ")) {
        return  next(new HttpException(401,"Unauthorized"));
    }

    const accessToken = bearer.split("Bearer ")[1].trim();

    try {
        // @ts-ignore
        const payload:IToken | jwt.JsonWebTokenError = await verifyJwt(
            accessToken
        );

        if(payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401,"Unauthorized"));
        }

        const user = await UserSchema
            .findById(payload.id)
            .select("-password")
            .exec()

        if(!user) {
            return next(new HttpException(401,"Unauthorized"));
        }

        req.user = user;
        return next();
    } catch (err:any) {
        return next(new HttpException(401,"Unauthorized"))
    }
}

export default authenticatedMiddleware;