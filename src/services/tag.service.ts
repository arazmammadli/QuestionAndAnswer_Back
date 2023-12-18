import TagModel from "@/models/tag.schema";
import {TagDto} from "@/dto/tag.dto";
import {Types} from "mongoose";
import QuestionModel from "@/models/question.schema";
import {TagQueryDto} from "@/dto/tag-query.dto";

class TagService {
    private tagModel  = TagModel;
    private questionModel = QuestionModel;

    public async createTag(
        dto:TagDto
    ) {
        try {
            const existingTag = await this.tagModel.findOne({
                $or:[
                    {name:dto.name}
                ]
            });

            let message:string;
            if (existingTag) {
                message = "tag with this name is already available";

                if(message.length > 0) {
                    throw new Error(message);
                }
            }
            const tag = await this.tagModel.create(dto);
            return {
                message:"Tag successfully created.",
                tag
            };
        } catch (err:any) {
            throw new Error("Unable to create tag.")
        }
    }

    public async getTags(
        {
            query,
            page,
            limit=20
        }:TagQueryDto
    ) {
        try {
            const pageQuery = Number(query) || 1;
            const limitQuery = Number(limit) || 20;
            const skip = (pageQuery - 1) * limitQuery;
            const totalTags = await this.tagModel.countDocuments({});

            const searchFilter = {name:{$regex:new RegExp(query,"i")}};


            const tags=  this.tagModel.find({...searchFilter}).skip(skip).limit(limitQuery).exec();
            return {
                tags,
                totalTags,
                pageQuery,
                success:true
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async updateTag(
        id:string,
        dto:TagDto
    ) {
        try {
            const tag = await this.tagModel.findById(id);
            if (!tag) {
                throw new Error("Tag not found.");
            }

            const updatedTag = await this.tagModel.findByIdAndUpdate(id, dto, {
                    new:true
                }
            );

            return {
                message:"Tag successfully updated",
                success:true,
                updatedTag
            };
        } catch (err:any) {
            throw new Error(err.message);
        }
    }

    public async deleteTag(
        id:string,
    ) {
        try {
            const tag = await this.tagModel.findById(id);
            if(!tag) {
                throw new Error("Tag not found.");
            }

            const questionsFind = await this.questionModel.find({tags: id});

            if(!questionsFind) {
                throw new Error("There are no questions related to the label.");
            }

            await this.questionModel.updateMany(
                {tags:id},
                {$pull:{tags: id}}
            );

            await this.tagModel.findByIdAndDelete(id);

            return {
                message:"Tag successfully deleted",
                success:true
            }
        } catch (err:any) {
            throw new Error(err.message)
        }
    }
}

export default TagService;
