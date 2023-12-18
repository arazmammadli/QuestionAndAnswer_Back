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
const user_schema_1 = __importDefault(require("@/models/user.schema"));
const cloudinary_1 = require("cloudinary");
const question_schema_1 = __importDefault(require("@/models/question.schema"));
const answer_schema_1 = __importDefault(require("@/models/answer.schema"));
const comment_schema_1 = __importDefault(require("@/models/comment.schema"));
class UserService {
    constructor() {
        this.userModel = user_schema_1.default;
        this.questionModel = question_schema_1.default;
        this.answerModel = answer_schema_1.default;
        this.commentModel = comment_schema_1.default;
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userModel.findById(id)
                    .populate("questions")
                    .populate({
                    path: "answers",
                    populate: {
                        path: "question",
                    }
                })
                    .select("-password");
                if (!user) {
                    throw new Error("User not found.");
                }
                return {
                    message: "Get user successfully",
                    success: true,
                    user
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    updateUser(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userModel.findById(id);
                if (!user) {
                    throw new Error("User not found.");
                }
                let uploadedFile;
                if (dto.file) {
                    try {
                        uploadedFile = (yield cloudinary_1.v2.uploader.upload(dto.file, {
                            folder: "User Images",
                            resource_type: "image",
                        }));
                    }
                    catch (err) {
                        throw new Error("Image could not be uploaded");
                    }
                }
                const updatedUser = yield this.userModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, dto), { img: uploadedFile !== undefined ? uploadedFile.secure_url : user.img }), { new: true });
                return {
                    message: "User updated successfully",
                    success: true,
                    updatedUser
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userModel.findById(userId);
                if (!user) {
                    throw new Error("User not found.");
                }
                yield this.questionModel.updateMany({ user: userId }, { $pull: { user: userId } });
                yield this.answerModel.updateMany({ user: userId }, { $pull: { user: userId } });
                yield this.commentModel.updateMany({ user: userId }, { $pull: { user: userId } });
                yield this.userModel.findByIdAndDelete(userId);
                return {
                    message: "User deleted successfully",
                    success: true
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getUsers({ page, query, limit = 30 }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageQuery = Number(page) || 1;
                const queryLimit = Number(limit) || 30;
                const skip = (pageQuery - 1) * queryLimit;
                const totalUsers = yield this.userModel.countDocuments({});
                const searchFilter = { name: { $regex: new RegExp(query, "i") } };
                const users = yield this.userModel.find(Object.assign({}, searchFilter))
                    .skip(skip)
                    .limit(queryLimit)
                    .populate("questions")
                    .populate("answers")
                    .select("-password").exec();
                return {
                    message: "Successfully",
                    success: true,
                    users,
                    totalUsers,
                    pageQuery
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userModel.findById(id)
                    .populate("questions")
                    .populate({
                    path: "answers",
                    populate: {
                        path: "question",
                    }
                })
                    .select("-password");
                if (!user) {
                    throw new Error("User not found.");
                }
                return {
                    message: "Get user successfully",
                    success: true,
                    user
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
}
exports.default = UserService;
