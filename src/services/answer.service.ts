import AnswerModel from "@/models/answer.schema";
import {AnswerCreateDto} from "@/dto/answer-create.dto";
import {Types} from "mongoose";
import QuestionModel from "@/models/question.schema";
import {AnswerUpdateDto} from "@/dto/answer-update.dto";
import UserModel from "@/models/user.schema";

class AnswerService {
    private answerModel = AnswerModel;
    private questionModel = QuestionModel;
    private userModel = UserModel;

    public async createAnswer(
        dto:AnswerCreateDto,
        userId:Types.ObjectId
    ) {
        try {
            const existingUser = await this.userModel.findById(userId);
            if(!existingUser) {
                throw new Error("User not found");
            }

            const existingAnswersCount = await this.answerModel.countDocuments({question: dto.questionId});
            const newAnswer = await this.answerModel.create(
                {
                    ...dto,
                    question:dto.questionId,
                    user:userId,
                    answerNumber:(existingAnswersCount + 1)
                }
            );

            await this.userModel.findByIdAndUpdate(
                userId,
                {$push:{answers:newAnswer._id}}
            );

            await this.questionModel.findByIdAndUpdate(
                dto.questionId,
                {$push:{answers: newAnswer._id}},
                {new:true}
            );

            return {
                success:true,
                message:"Answer created successfully.",
                answer:newAnswer
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async getAnswer(
        answerId:string
    ) {
        try {
            const answer = await this.answerModel.findById(answerId);

            if(!answer) {
                throw new Error("Answer not found.");
            }

            return {
                message:"Successfully",
                success:true,
                answer
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async updateAnswer(
        answerId:string,
        dto:AnswerUpdateDto
    ) {
        try {
            const answer = await this.answerModel.findById(answerId);

            if(!answer) {
                throw new Error("Answer not found.");
            }

            const updatedAnswer = await this.answerModel.findByIdAndUpdate(
                answerId,
                {...dto},
                {new:true}
            );

            await this.questionModel.updateOne(
                {answers: answerId},
                {$set:{'answers.$':updatedAnswer?._id}}
            );

             return {
                 message:"Answer updated successfully",
                 success:true,
                 answer:updatedAnswer
             }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async deleteAnswer(
        answerId:string
    ) {
        try {
            const answer = await this.questionModel.findById(answerId);

            if(!answer) {
                throw new Error("Answer not found.");
            }

            await this.questionModel.updateOne(
                {answers: answerId},
                {$pull:{answers: answerId}}
            );

            await this.userModel.findByIdAndUpdate(
                answer.user,
                {$pull:{answers:answerId}}
            )

            await this.answerModel.findByIdAndDelete(answerId);

            return {
                message:"Answer deleted successfully.",
                success:true
            }

        } catch (err:any) {
            throw new Error(err.message);
        }
    }
}

export default AnswerService;