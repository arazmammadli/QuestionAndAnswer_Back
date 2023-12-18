import {Schema} from "mongoose";

interface IToken extends Schema {
    id:Schema.Types.ObjectId;
    expiresIn:number;
};

export default IToken;