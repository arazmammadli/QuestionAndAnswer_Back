import {Schema,model} from "mongoose";
import ITag from "@/utils/interfaces/tag.interface";

const TagSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true
        },
        description:{
            type:String,
            required:true
        },
        posts:[{
            type:Schema.Types.ObjectId,
            ref:"Questions"
        }]
    },
    {timestamps:true}
);

export default model("Tags",TagSchema);