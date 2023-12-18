import {IsNotEmpty, IsString} from "class-validator";

export class AnswerCreateDto {
    @IsNotEmpty()
    @IsString()
    answer:string;

    @IsNotEmpty()
    @IsString()
    questionId:string;
}