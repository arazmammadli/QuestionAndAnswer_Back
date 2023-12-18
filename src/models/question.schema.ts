import {Schema, model} from "mongoose";

const QuestionSchema = new Schema(
    {
        title:{
            type:String,
            required:true
        },
        slug:{
            type:String,
            unique:true
        },
        views:{
            type:[String],
            default:[]
        },
        problemDetail:{
            type:String,
            required:true
        },
        problemViews:{
            type:String
        },
        tags:{
            type:[String],
            required:true
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:"Users"
        },
        answers:[{
            type:Schema.Types.ObjectId,
            ref:"Answers"
        }],
        comments:[{
            type:Schema.Types.ObjectId,
            ref:"Comments"
        }]
    },
    {timestamps:true}
);

export default model("Questions",QuestionSchema);