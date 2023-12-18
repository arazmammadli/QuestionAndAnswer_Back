import {IsEmail, IsString,IsNotEmpty,MinLength} from "class-validator";

export class UserLoginDto {
    @IsNotEmpty({ message: 'Email field cannot be empty.' })
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    email: string;

    @IsNotEmpty({ message: 'Password field cannot be empty.' })
    @IsString({message: "Password is required!"})
    @MinLength(6, { message: 'Password must be at least 6 characters long.' })
    password: string;
}