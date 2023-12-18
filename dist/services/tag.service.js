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
const tag_schema_1 = __importDefault(require("@/models/tag.schema"));
const question_schema_1 = __importDefault(require("@/models/question.schema"));
class TagService {
    constructor() {
        this.tagModel = tag_schema_1.default;
        this.questionModel = question_schema_1.default;
    }
    createTag(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingTag = yield this.tagModel.findOne({
                    $or: [
                        { name: dto.name }
                    ]
                });
                let message;
                if (existingTag) {
                    message = "tag with this name is already available";
                    if (message.length > 0) {
                        throw new Error(message);
                    }
                }
                const tag = yield this.tagModel.create(dto);
                return {
                    message: "Tag successfully created.",
                    tag
                };
            }
            catch (err) {
                throw new Error("Unable to create tag.");
            }
        });
    }
    getTags({ query, page, limit = 20 }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageQuery = Number(query) || 1;
                const limitQuery = Number(limit) || 20;
                const skip = (pageQuery - 1) * limitQuery;
                const totalTags = yield this.tagModel.countDocuments({});
                const searchFilter = { name: { $regex: new RegExp(query, "i") } };
                const tags = this.tagModel.find(Object.assign({}, searchFilter)).skip(skip).limit(limitQuery).exec();
                return {
                    tags,
                    totalTags,
                    pageQuery,
                    success: true
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    updateTag(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = yield this.tagModel.findById(id);
                if (!tag) {
                    throw new Error("Tag not found.");
                }
                const updatedTag = yield this.tagModel.findByIdAndUpdate(id, dto, {
                    new: true
                });
                return {
                    message: "Tag successfully updated",
                    success: true,
                    updatedTag
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    deleteTag(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = yield this.tagModel.findById(id);
                if (!tag) {
                    throw new Error("Tag not found.");
                }
                const questionsFind = yield this.questionModel.find({ tags: id });
                if (!questionsFind) {
                    throw new Error("There are no questions related to the label.");
                }
                yield this.questionModel.updateMany({ tags: id }, { $pull: { tags: id } });
                yield this.tagModel.findByIdAndDelete(id);
                return {
                    message: "Tag successfully deleted",
                    success: true
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
}
exports.default = TagService;
