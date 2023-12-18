import {Schema,model} from "mongoose";

const AnswerSchema = new Schema(
    {
        answer:{
            type:String,
            required:true
        },
        answerNumber:{
            type:Number
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:"Users"
        },
        question:{
            type:Schema.Types.ObjectId,
            ref:"Questions"
        }
    },
    {timestamps:true}
);

export default model("Answers",AnswerSchema);