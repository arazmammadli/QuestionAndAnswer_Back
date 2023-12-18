import CommentModel from "@/models/comment.schema";
import {CommentDto} from "@/dto/comment.dto";
import {Query, Types} from "mongoose";
import QuestionModel from "@/models/question.schema";
class CommentService {
    private commentModel = CommentModel;
    private questionModel = QuestionModel;

    public async createComment(
        dto:CommentDto,
        userId:Types.ObjectId,
    ) {
        try {
            const newComment = new this.commentModel({...dto,user:userId,question:dto.questionId});
            await newComment.save();

            //updating the post with the comments id
            const question = await this.questionModel.findById(dto.questionId);

            if(!question) {
                throw new Error("Question not found.")
            }

            question.comments.push(newComment._id);

            await this.questionModel.findByIdAndUpdate(dto.questionId,question,{
                new:true
            })

            return {
                message:"Comment created successfully",
                success:true,
                newComment
            }

        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async getComments(
        questionId:string
    ) {
        try {
            const questionComments = await this.commentModel.find({question:questionId})
                .populate({
                    path:"user",
                    select:"-password"
                });

            return {
                success:true,
                message:"Successfully",
                data:questionComments
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async deleteComment(
        id:string,
        questionId:string
    ) {
        try {
            const comment = await this.commentModel.findById(id);

            if(!comment) {
                throw new Error("Comment not found.")
            }

            await this.commentModel.findByIdAndDelete(id);

            //removing comment id from post
            const result = await this.questionModel.updateOne(
                {_id:questionId},
                {$pull:{comments: id}}
            );

            if(result.modifiedCount > 0) {
                return {
                    success:true,
                    message:"Comment removed successfully."
                }
            } else {
                return {
                    message:"Post not found.",
                    success:false
                }
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }
}

export default CommentService;