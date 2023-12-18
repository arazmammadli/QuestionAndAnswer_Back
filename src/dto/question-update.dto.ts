import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class QuestionUpdateDto {

    @IsOptional()
    @IsString()
    title:string;

    @IsOptional()
    @IsString()
    problemDetail:string;

    @IsOptional()
    @IsString()
    problemViews:string;

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    tags:string[]
}