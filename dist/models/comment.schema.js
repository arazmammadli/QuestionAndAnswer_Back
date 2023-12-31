"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users"
    },
    question: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Questions"
    },
    desc: {
        type: String
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Comments", CommentSchema);
