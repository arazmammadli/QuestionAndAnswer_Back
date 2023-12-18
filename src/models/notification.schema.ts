import {Schema,model} from "mongoose";

const NotificationSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    },
    desc:{
        type:String,
        required:true
    },
    isReaded:{
        type:Boolean,
        default:false
    }
});

export default model("Notifications",NotificationSchema);