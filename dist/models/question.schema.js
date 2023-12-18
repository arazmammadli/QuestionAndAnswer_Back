"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const QuestionSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    views: {
        type: [String],
        default: []
    },
    problemDetail: {
        type: String,
        required: true
    },
    problemViews: {
        type: String
    },
    tags: {
        type: [String],
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users"
    },
    answers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Answers"
        }],
    comments: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comments"
        }]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Questions", QuestionSchema);
