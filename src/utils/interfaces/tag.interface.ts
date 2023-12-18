import {Types} from "mongoose";

export default interface ITag extends Document {
    _id:Types.ObjectId;
    name:string;
    _doc:any;
};