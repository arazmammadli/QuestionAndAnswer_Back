import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class TagDto {
    @IsNotEmpty({message:"Tag name cannot be empty"})
    @IsString({message: "Name must be a string"})
    name: string;

    @IsNotEmpty()
    @IsString()
    description:string;
}