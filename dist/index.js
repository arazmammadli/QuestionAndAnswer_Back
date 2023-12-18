"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const app_1 = __importDefault(require("./app"));
const auth_controller_1 = __importDefault(require("@/controllers/auth.controller"));
const tag_controller_1 = __importDefault(require("@/controllers/tag.controller"));
const question_controller_1 = __importDefault(require("@/controllers/question.controller"));
const comment_controller_1 = __importDefault(require("@/controllers/comment.controller"));
const answer_controller_1 = __importDefault(require("@/controllers/answer.controller"));
const user_controller_1 = __importDefault(require("@/controllers/user.controller"));
const app = new app_1.default([
    new auth_controller_1.default(),
    new tag_controller_1.default(),
    new question_controller_1.default(),
    new comment_controller_1.default(),
    new answer_controller_1.default(),
    new user_controller_1.default()
], Number(process.env.PORT) || 5000);
app.listen();
