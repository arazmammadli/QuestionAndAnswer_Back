import {Types} from "mongoose";

export class QuestionQueryDto {
    page:number;
    limit:number;
    tag:string;
    userId:string;
};