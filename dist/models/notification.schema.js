"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users"
    },
    desc: {
        type: String,
        required: true
    },
    isReaded: {
        type: Boolean,
        default: false
    }
});
exports.default = (0, mongoose_1.model)("Notifications", NotificationSchema);
