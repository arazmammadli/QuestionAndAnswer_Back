import {IsOptional, IsString} from "class-validator";

export class AnswerUpdateDto {
    @IsOptional()
    @IsString()
    answer:string;
}