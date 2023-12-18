import jwt from "jsonwebtoken";
import {Expression} from "mongoose";
import {ObjectId} from "mongoose";
import * as process from "process";
import IToken from "@/utils/interfaces/token.interface";

export const createToken = (id:ObjectId):string => {
    return jwt.sign({id:id},process.env.JWT_SECRET as jwt.Secret,{
        expiresIn:"15d"
    })
};

export const verifyJwt = async  (
    token:string
)=> {
    return  new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SECRET as jwt.Secret,
            (err,payload) => {
                if(err) return reject(err);

                resolve(payload as IToken)
            }
        )
    })
}

export default {createToken,verifyJwt}