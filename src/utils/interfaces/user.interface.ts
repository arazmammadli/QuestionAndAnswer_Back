import {Document,Types} from "mongoose";


export default interface IUser extends Document {
    _id:Types.ObjectId;
    img:string;
    name:string;
    surname:string;
    about:string;
    email:string;
    questions:Types.ObjectId[];
    answers:Types.ObjectId[];
    password:string;
    _doc:any;
};

export type UserType = Record<string, any> & IUser;