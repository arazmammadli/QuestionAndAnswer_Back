import {IsNotEmpty, IsString} from "class-validator";

export class CommentDto {
    @IsNotEmpty()
    @IsString()
    desc:string;

    @IsNotEmpty()
    @IsString()
    questionId:string;
}