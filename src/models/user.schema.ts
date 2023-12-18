import {Schema,model} from "mongoose";
import {UserType} from "@/utils/interfaces/user.interface";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    name:{
        type:String,
        required:true,
        minLength:3
    },
    surname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true
    },
    questions:[{
        type:Schema.Types.ObjectId,
        ref:"Questions"
    }],
    answers:[
        {
            type:Schema.Types.ObjectId,
            ref:"Answers"
        }
    ],
    password:{
        type:String,
        required:[false,"Please enter your password"]
    },
    img:{
        type:String,
        required:false
    },
    about:{
        type:String,
        required:false
    }
},{timestamps:true});

UserSchema.pre<UserType>("save",async function (next) {
    if(!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await  bcrypt.hash(this.password,salt);
    this.password = hash;
    next();
});

export default model<UserType>("Users",UserSchema);
