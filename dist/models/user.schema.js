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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true
    },
    questions: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Questions"
        }],
    answers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Answers"
        }
    ],
    password: {
        type: String,
        required: [false, "Please enter your password"]
    },
    img: {
        type: String,
        required: false
    },
    about: {
        type: String,
        required: false
    }
}, { timestamps: true });
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(this.password, salt);
        this.password = hash;
        next();
    });
});
exports.default = (0, mongoose_1.model)("Users", UserSchema);
