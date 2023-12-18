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
const express_1 = require("express");
const question_service_1 = __importDefault(require("@/services/question.service"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
class QuestionController {
    constructor() {
        this.path = "/question";
        this.router = (0, express_1.Router)();
        this.QuestionService = new question_service_1.default();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.body;
                const userId = req.user._id;
                const { question, message, success } = yield this.QuestionService.createQuestion(dto, userId);
                res.status(201).json({
                    success,
                    message,
                    question
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.body;
                const { id } = req.params;
                const { message, success, updatedQuestion } = yield this.QuestionService.updateQuestion(id, dto);
                success ? res.status(200).json({
                    message,
                    success,
                    data: updatedQuestion
                }) : res.status(404).json({
                    message,
                    success
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { message, success } = yield this.QuestionService.deleteQuestion(id);
                res.json(200).json({
                    message,
                    success
                });
            }
            catch (err) {
                next(new http_exception_1.default(404, err.message));
            }
        });
        this.questions = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.query;
                const { questions, success, totalPost, message, totalPages } = yield this.QuestionService.getQuestions(dto);
                res.status(200).json({
                    success,
                    data: {
                        count: totalPost,
                        questions,
                        totalPages
                    },
                    message
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.question = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const { question, message, success } = yield this.QuestionService.getQuestion(slug);
                res.status(200).json({
                    message,
                    success,
                    data: question
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.route(`${this.path}`)
            .post(authenticated_middleware_1.default, this.create)
            .get(this.questions);
        this.router.get(`${this.path}/:slug`, this.question);
        this.router.put(`${this.path}/:id`, authenticated_middleware_1.default, this.update);
        this.router.delete(`${this.path}/:id`, authenticated_middleware_1.default, this.delete);
    }
}
exports.default = QuestionController;
