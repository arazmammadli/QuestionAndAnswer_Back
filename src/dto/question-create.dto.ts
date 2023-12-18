import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";


export class QuestionCreateDto {
    @IsNotEmpty()
    @IsString()
    title:string;

    @IsString()
    problemDetail:string;

    @IsString()
    problemViews:string;

    @IsArray()
    @IsString({each:true})
    @IsOptional()
    tags:string[]
}