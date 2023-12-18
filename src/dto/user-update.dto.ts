import {IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class UserUpdateDto {
    @IsOptional()
    @IsNotEmpty({message:"Name cannot be empty"})
    @IsString({message: "Name must be a string"})
    @MinLength(3)
    @MaxLength(50, { message: 'name must be at most 50 characters long' })
    name: string;

    @IsOptional()
    @IsNotEmpty({ message: "Surname cannot be empty" })
    @MinLength(4)
    @IsString({ message: "Surname must be a string" })
    surname: string;

    @IsOptional()
    @IsString({ message: "Surname must be a string" })
    @MinLength(30)
    about:string;

    @IsOptional({ message: "Image is optional." })
    @IsString({ message: "Image must be a string" })
    file: string;
}