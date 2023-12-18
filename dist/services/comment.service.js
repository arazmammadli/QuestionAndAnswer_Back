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
const comment_schema_1 = __importDefault(require("@/models/comment.schema"));
const question_schema_1 = __importDefault(require("@/models/question.schema"));
class CommentService {
    constructor() {
        this.commentModel = comment_schema_1.default;
        this.questionModel = question_schema_1.default;
    }
    createComment(dto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newComment = new this.commentModel(Object.assign(Object.assign({}, dto), { user: userId, question: dto.questionId }));
                yield newComment.save();
                //updating the post with the comments id
                const question = yield this.questionModel.findById(dto.questionId);
                if (!question) {
                    throw new Error("Question not found.");
                }
                question.comments.push(newComment._id);
                yield this.questionModel.findByIdAndUpdate(dto.questionId, question, {
                    new: true
                });
                return {
                    message: "Comment created successfully",
                    success: true,
                    newComment
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getComments(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionComments = yield this.commentModel.find({ question: questionId })
                    .populate({
                    path: "user",
                    select: "-password"
                });
                return {
                    success: true,
                    message: "Successfully",
                    data: questionComments
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    deleteComment(id, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.commentModel.findById(id);
                if (!comment) {
                    throw new Error("Comment not found.");
                }
                yield this.commentModel.findByIdAndDelete(id);
                //removing comment id from post
                const result = yield this.questionModel.updateOne({ _id: questionId }, { $pull: { comments: id } });
                if (result.modifiedCount > 0) {
                    return {
                        success: true,
                        message: "Comment removed successfully."
                    };
                }
                else {
                    return {
                        message: "Post not found.",
                        success: false
                    };
                }
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
}
exports.default = CommentService;
