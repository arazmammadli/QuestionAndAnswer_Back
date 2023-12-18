import UserModel from "@/models/user.schema"
import {UserRegisterDto} from "@/dto/user-register.dto";
import HttpException from "@/utils/exceptions/http.exception";
import token from "@/utils/token";
import {Document} from "mongoose";
import IUser from "@/utils/interfaces/user.interface";
import {UserLoginDto} from "@/dto/user-login.dto";
import {compare} from "bcrypt";
class AuthService {
    private user = UserModel;

    public async register(dto:Record<string, any> & UserRegisterDto) {
        try {
            const existingUser = await this.user.findOne({
                $or:[
                    {email:dto.email}
                ]
            });

            const uniqueFields = ["email"];
            const messages = [];

            if (existingUser) {
                for (const value of uniqueFields) {
                    if (existingUser[value] === dto[value]) {
                        messages.push(`${value} already exists`);
                    }
                }

                if(messages.length>0) {
                    throw new HttpException(409,messages.join(","))
                }
            }

            const newUser = await this.user.create(dto);
            const user = await this.user.findById(newUser.id).populate("questions");
            const accessToken:string = token.createToken(newUser.id);

            return {
                success:true,
                user: this.generateAuthFields(user as IUser),
                token: accessToken,
            };
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async login(dto:UserLoginDto) {
        try {
            const user = await this.validateUser(dto);
            const generateToken = token.createToken(user.id);
            return {
                success:true,
                user:this.generateAuthFields(user),
                token:generateToken
            }
        } catch (error:any) {
            throw new Error("Unable to create user.")
        }
    }

    private async validateUser(dto:UserLoginDto) {
        const user = await this.user.findOne({
            $or:[{email:dto.email}]
        }).populate("questions").exec();

        if(!user) {
            throw new Error("Unable to find user with that email address");
        }

        const match = await compare(dto.password,user.password);

        if(!match) {
            throw new Error("Invalid credentials");
        }


        return user as IUser & Pick<Document, "id">;
    }
    generateAuthFields(user: IUser) {
        const { email, name,surname,img,questions } = user;
        return { email, name, surname, img,questions };
    }
};

export default AuthService;