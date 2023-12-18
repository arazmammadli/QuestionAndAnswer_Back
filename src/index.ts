import "dotenv/config";
import "module-alias/register";
import App from "./app";
import AuthController from "@/controllers/auth.controller";
import TagController from "@/controllers/tag.controller";
import QuestionController from "@/controllers/question.controller";
import CommentController from "@/controllers/comment.controller";
import AnswerController from "@/controllers/answer.controller";
import UserController from "@/controllers/user.controller";

const app = new App([
    new AuthController(),
    new TagController(),
    new QuestionController(),
    new CommentController(),
    new AnswerController(),
    new UserController()
],Number(process.env.PORT) || 5000);

app.listen();