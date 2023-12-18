import {Schema,model} from "mongoose";

const CommentSchema = new Schema(
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:"Users"
        },
        question:{
            type:Schema.Types.ObjectId,
            ref:"Questions"
        },
        desc:{
            type:String
        }
    },
    {timestamps:true}
);

export default model("Comments",CommentSchema);