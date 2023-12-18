"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AnswerSchema = new mongoose_1.Schema({
    answer: {
        type: String,
        required: true
    },
    answerNumber: {
        type: Number
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users"
    },
    question: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Questions"
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Answers", AnswerSchema);
