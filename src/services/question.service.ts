import QuestionModel from "@/models/question.schema";
import {QuestionCreateDto} from "@/dto/question-create.dto";
import slugify from "slugify";
// import TagModel from "@/models/tag.schema";
import {QuestionUpdateDto} from "@/dto/question-update.dto";
import {Types} from "mongoose";
import {QuestionQueryDto} from "@/dto/question-query.dto";
import UserModel from "@/models/user.schema";

class QuestionService {
    private questionModel = QuestionModel;
    // private tagModel = TagModel;
    private userModel = UserModel;

    async createSlug(title: string) {
        let slug: string = slugify(title).toLowerCase();
        const questionBySlug = await this.questionModel.findOne({ slug });

        if (questionBySlug) {
            while (questionBySlug.slug === slug) {
                slug += Math.floor(
                    Math.random() * Number(Date.now().toString().slice(10, 13)),
                );
            }
        }

        return slug;
    }
    public async createQuestion(
        dto:QuestionCreateDto,
        userId:Types.ObjectId
    ) {
        try {
            const slug = await this.createSlug(dto.title);

            const question = await this.questionModel.create({...dto,slug,user:userId});

            const existingUser = await this.userModel.findById(userId);

            if(!existingUser) {
                throw new Error("User not found");
            }

            await this.userModel.findByIdAndUpdate(
                userId,
                {$push:{questions:question._id}},
            );

            // const existingTags = await this.tagModel.find({_id: {$in:dto.tags}});
            //
            // const tagUpdatePromises = existingTags.map(async (tag) => {
            //     tag.posts.push(question._id);
            //     await tag.save();
            // });
            //
            // await Promise.all(tagUpdatePromises);
            return {
                message:"Question created successfully",
                success:true,
                question
            };
        } catch (err:any) {
            throw new Error(err.message)
        }
    }

    public async updateQuestion(
        id:string,
        dto:QuestionUpdateDto
    ) {
        try {
            const question = await this.questionModel.findById(id);

            if(!question) {
                throw new Error("Question not found.");
            }

            const slug = await this.createSlug(dto.title);

            const updatedQuestion = await this.questionModel.findByIdAndUpdate(
                id,
                {...dto,slug},
                {
                    new:true
                }
            );

            if(updatedQuestion) {
                // if(dto.tags) {
                //     await Promise.all(
                //         dto.tags.map( async (tagId) => {
                //             await this.tagModel.findByIdAndUpdate(tagId,{$set:{posts: updatedQuestion._id}})
                //         })
                //     )
                // }
                return {
                    message:"Question updated successfully",
                    success:true,
                    updatedQuestion
                }
            } else  {
                return {
                    message:"Question not found",
                    success:false,
                    updatedQuestion
                }
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async deleteQuestion(
        id:string
    ) {
        try {
            const question = await this.questionModel.findById(id);

            if(!question) {
                throw new Error("Question not found.");
            }

            // await this.tagModel.updateMany(
            //     {posts: question._id},
            //     {$pull:{posts: question._id}}
            // );

            await this.userModel.findByIdAndUpdate(question.user,{$pull:{questions:question._id}});

            await this.questionModel.findByIdAndDelete(id);

            return {
                success:true,
                message:"Question successfully deleted.",
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async getQuestions(
        {
            tag,
            page,
            limit,
            userId
        }:QuestionQueryDto
    ) {
        try {
            let query = {};

            if (tag && userId) {
                query = { tags: tag, user: userId };
            } else if (tag) {
                query = { tags: tag };
            } else if (userId) {
                query = { user: userId };
            }
            const pageQuery = Number(page) || 1;
            const pageLimit = Number(limit) || 8;
            const skip = (pageQuery - 1) * pageLimit;
            const totalPost = await this.questionModel.countDocuments({});
            const totalPages = Math.ceil(totalPost / pageLimit);


            const questions = await this.questionModel.find({...query})
                .populate({
                    path:"user",
                    select:"-password"
                })
                .populate("comments")
                .populate("answers")
                .skip(skip).limit(pageLimit).sort({ _id: -1 }).exec();

            return {
                questions,
                totalPost,
                success:true,
                message:"Successfully.",
                totalPages
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async getQuestion(
        slug:string
    ) {
        try {
            const question = await this.questionModel.findOne({slug})
                .populate({
                    path:"user",
                    select:"-password"
                })
                .populate({
                    path:"comments",
                    populate:{
                        path:"user",
                        select:"-password"
                    }
                })
                .populate({
                    path:"answers",
                    populate:{
                        path:"user",
                        select:"-password"
                    }
                })
                .exec();

            if(!question) {
                throw new Error("Question not found.");
            }

            if(!question.views.includes(String(question.user?._id))) {
                question.views.push(String(question.user?._id))
                await question.save();
            }

            return {
                message:"You have successfully received the question",
                success:true,
                question
            };
        }catch (err:any) {
            throw new Error(err.message);
        }
    }
}

export default QuestionService;