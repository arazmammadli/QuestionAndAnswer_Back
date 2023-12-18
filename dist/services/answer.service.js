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
const answer_schema_1 = __importDefault(require("@/models/answer.schema"));
const question_schema_1 = __importDefault(require("@/models/question.schema"));
const user_schema_1 = __importDefault(require("@/models/user.schema"));
class AnswerService {
    constructor() {
        this.answerModel = answer_schema_1.default;
        this.questionModel = question_schema_1.default;
        this.userModel = user_schema_1.default;
    }
    createAnswer(dto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userModel.findById(userId);
                if (!existingUser) {
                    throw new Error("User not found");
                }
                const existingAnswersCount = yield this.answerModel.countDocuments({ question: dto.questionId });
                const newAnswer = yield this.answerModel.create(Object.assign(Object.assign({}, dto), { question: dto.questionId, user: userId, answerNumber: (existingAnswersCount + 1) }));
                yield this.userModel.findByIdAndUpdate(userId, { $push: { answers: newAnswer._id } });
                yield this.questionModel.findByIdAndUpdate(dto.questionId, { $push: { answers: newAnswer._id } }, { new: true });
                return {
                    success: true,
                    message: "Answer created successfully.",
                    answer: newAnswer
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getAnswer(answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const answer = yield this.answerModel.findById(answerId);
                if (!answer) {
                    throw new Error("Answer not found.");
                }
                return {
                    message: "Successfully",
                    success: true,
                    answer
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    updateAnswer(answerId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const answer = yield this.answerModel.findById(answerId);
                if (!answer) {
                    throw new Error("Answer not found.");
                }
                const updatedAnswer = yield this.answerModel.findByIdAndUpdate(answerId, Object.assign({}, dto), { new: true });
                yield this.questionModel.updateOne({ answers: answerId }, { $set: { 'answers.$': updatedAnswer === null || updatedAnswer === void 0 ? void 0 : updatedAnswer._id } });
                return {
                    message: "Answer updated successfully",
                    success: true,
                    answer: updatedAnswer
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    deleteAnswer(answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const answer = yield this.questionModel.findById(answerId);
                if (!answer) {
                    throw new Error("Answer not found.");
                }
                yield this.questionModel.updateOne({ answers: answerId }, { $pull: { answers: answerId } });
                yield this.userModel.findByIdAndUpdate(answer.user, { $pull: { answers: answerId } });
                yield this.answerModel.findByIdAndDelete(answerId);
                return {
                    message: "Answer deleted successfully.",
                    success: true
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
}
exports.default = AnswerService;
