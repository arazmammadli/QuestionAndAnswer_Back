"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const question_schema_1 = __importDefault(require("@/models/question.schema"));
const slugify_1 = __importDefault(require("slugify"));
const user_schema_1 = __importDefault(require("@/models/user.schema"));
class QuestionService {
    constructor() {
        this.questionModel = question_schema_1.default;
        // private tagModel = TagModel;
        this.userModel = user_schema_1.default;
    }
    createSlug(title) {
        return __awaiter(this, void 0, void 0, function* () {
            let slug = (0, slugify_1.default)(title).toLowerCase();
            const questionBySlug = yield this.questionModel.findOne({ slug });
            if (questionBySlug) {
                while (questionBySlug.slug === slug) {
                    slug += Math.floor(Math.random() * Number(Date.now().toString().slice(10, 13)));
                }
            }
            return slug;
        });
    }
    createQuestion(dto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = yield this.createSlug(dto.title);
                const question = yield this.questionModel.create(Object.assign(Object.assign({}, dto), { slug, user: userId }));
                const existingUser = yield this.userModel.findById(userId);
                if (!existingUser) {
                    throw new Error("User not found");
                }
                yield this.userModel.findByIdAndUpdate(userId, { $push: { questions: question._id } });
                // const existingTags = await this.tagModel.find({_id: {$in:dto.tags}});
                //
                // const tagUpdatePromises = existingTags.map(async (tag) => {
                //     tag.posts.push(question._id);
                //     await tag.save();
                // });
                //
                // await Promise.all(tagUpdatePromises);
                return {
                    message: "Question created successfully",
                    success: true,
                    question
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    updateQuestion(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const question = yield this.questionModel.findById(id);
                if (!question) {
                    throw new Error("Question not found.");
                }
                const slug = yield this.createSlug(dto.title);
                const updatedQuestion = yield this.questionModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, dto), { slug }), {
                    new: true
                });
                if (updatedQuestion) {
                    // if(dto.tags) {
                    //     await Promise.all(
                    //         dto.tags.map( async (tagId) => {
                    //             await this.tagModel.findByIdAndUpdate(tagId,{$set:{posts: updatedQuestion._id}})
                    //         })
                    //     )
                    // }
                    return {
                        message: "Question updated successfully",
                        success: true,
                        updatedQuestion
                    };
                }
                else {
                    return {
                        message: "Question not found",
                        success: false,
                        updatedQuestion
                    };
                }
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    deleteQuestion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const question = yield this.questionModel.findById(id);
                if (!question) {
                    throw new Error("Question not found.");
                }
                // await this.tagModel.updateMany(
                //     {posts: question._id},
                //     {$pull:{posts: question._id}}
                // );
                yield this.userModel.findByIdAndUpdate(question.user, { $pull: { questions: question._id } });
                yield this.questionModel.findByIdAndDelete(id);
                return {
                    success: true,
                    message: "Question successfully deleted.",
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getQuestions({ tag, page, limit, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = {};
                if (tag && userId) {
                    query = { tags: tag, user: userId };
                }
                else if (tag) {
                    query = { tags: tag };
                }
                else if (userId) {
                    query = { user: userId };
                }
                const pageQuery = Number(page) || 1;
                const pageLimit = Number(limit) || 8;
                const skip = (pageQuery - 1) * pageLimit;
                const totalPost = yield this.questionModel.countDocuments({});
                const totalPages = Math.ceil(totalPost / pageLimit);
                const questions = yield this.questionModel.find(Object.assign({}, query))
                    .populate({
                    path: "user",
                    select: "-password"
                })
                    .populate("comments")
                    .populate("answers")
                    .skip(skip).limit(pageLimit).sort({ _id: -1 }).exec();
                return {
                    questions,
                    totalPost,
                    success: true,
                    message: "Successfully.",
                    totalPages
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getQuestion(slug) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const question = yield this.questionModel.findOne({ slug })
                    .populate({
                    path: "user",
                    select: "-password"
                })
                    .populate({
                    path: "comments",
                    populate: {
                        path: "user",
                        select: "-password"
                    }
                })
                    .populate({
                    path: "answers",
                    populate: {
                        path: "user",
                        select: "-password"
                    }
                })
                    .exec();
                if (!question) {
                    throw new Error("Question not found.");
                }
                if (!question.views.includes(String((_a = question.user) === null || _a === void 0 ? void 0 : _a._id))) {
                    question.views.push(String((_b = question.user) === null || _b === void 0 ? void 0 : _b._id));
                    yield question.save();
                }
                return {
                    message: "You have successfully received the question",
                    success: true,
                    question
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
}
exports.default = QuestionService;
