import {IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength} from "class-validator";

export class UserRegisterDto {
    @IsNotEmpty({message:"Name cannot be empty"})
    @IsString({message: "Name must be a string"})
    @MinLength(3)
    @MaxLength(50, { message: 'name must be at most 50 characters long' })
    name: string;

    @IsNotEmpty({ message: "Surname cannot be empty" })
    @MinLength(4)
    @IsString({ message: "Surname must be a string" })
    surname: string;

    @IsNotEmpty({ message: "Email cannot be empty" })
    @IsEmail({}, {message: "Wrong email!"})
    email:string;

    @IsNotEmpty({ message: "Password cannot be empty" })
    @IsString({ message: "Password must be a string" })
    @MinLength(6, { message: 'password must be at least 6 characters long' })
    password: string;
}