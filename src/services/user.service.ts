import UserModel from "@/models/user.schema";
import {UserUpdateDto} from "@/dto/user-update.dto";
import {v2 as cloudinary,UploadApiResponse} from "cloudinary";
import {Types} from "mongoose";
import QuestionModel from "@/models/question.schema";
import AnswerModel from "@/models/answer.schema";
import CommentModel from "@/models/comment.schema";
import {UserQueryDto} from "@/dto/user-query.dto";

class UserService {
    private userModel = UserModel;
    private questionModel = QuestionModel;
    private answerModel = AnswerModel;
    private commentModel = CommentModel;

    public async getProfile(
        id:Types.ObjectId
    ) {
        try {
            const user = await this.userModel.findById(id)
                .populate("questions")
                .populate({
                    path:"answers",
                    populate:{
                        path:"question",
                    }
                })
                .select("-password");

            if(!user) {
                throw new Error("User not found.");
            }

            return {
                message:"Get user successfully",
                success:true,
                user
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async updateUser(
        id:Types.ObjectId,
        dto:UserUpdateDto
    ) {
        try {
            const user = await this.userModel.findById(id);
            if(!user) {
                throw new Error("User not found.");
            }

            let uploadedFile:UploadApiResponse | undefined;
            if(dto.file) {
                try {
                    uploadedFile = await cloudinary.uploader.upload(dto.file,{
                        folder:"User Images",
                        resource_type:"image",
                    }) as UploadApiResponse;
                } catch (err:any) {
                    throw new Error("Image could not be uploaded");
                }
            }

            const updatedUser = await this.userModel.findByIdAndUpdate(
                id,
                {...dto,img:uploadedFile !== undefined ? uploadedFile.secure_url : user.img},
                {new:true}
            );

            return {
                message:"User updated successfully",
                success:true,
                updatedUser
            }
        } catch (err:any) {
            throw new Error(err.message)
        }
    }

    public async deleteUser(
        userId:Types.ObjectId
    ) {
        try {
            const user = await this.userModel.findById(userId);

            if(!user) {
                throw new Error("User not found.");
            }

            await this.questionModel.updateMany(
                {user:userId},
                {$pull:{user: userId}}
            );

            await this.answerModel.updateMany(
                {user: userId},
                {$pull:{user: userId}}
            );

            await this.commentModel.updateMany(
                {user: userId},
                {$pull:{user: userId}}
            );

            await this.userModel.findByIdAndDelete(userId);

            return {
                message:"User deleted successfully",
                success:true
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async getUsers(
        {
            page,
            query,
            limit=30
        }:UserQueryDto
    ){
        try {
            const pageQuery = Number(page) || 1;
            const queryLimit = Number(limit) || 30;
            const skip = (pageQuery - 1) * queryLimit;
            const totalUsers = await this.userModel.countDocuments({});

            const searchFilter = {name:{$regex:new RegExp(query,"i")}};

            const users = await this.userModel.find({...searchFilter})
                .skip(skip)
                .limit(queryLimit)
                .populate("questions")
                .populate("answers")
                .select("-password").exec();

            return {
                message:"Successfully",
                success:true,
                users,
                totalUsers,
                pageQuery
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async getUser(
        id:string
    ) {
        try {
            const user = await this.userModel.findById(id)
                .populate("questions")
                .populate({
                    path:"answers",
                    populate:{
                        path:"question",
                    }
                })
                .select("-password");

            if(!user) {
                throw new Error("User not found.");
            }

            return {
                message:"Get user successfully",
                success:true,
                user
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }
}

export default UserService;