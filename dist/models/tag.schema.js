"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TagSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    posts: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Questions"
        }]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Tags", TagSchema);
