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
const answer_service_1 = __importDefault(require("@/services/answer.service"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
class AnswerController {
    constructor() {
        this.path = "/answer";
        this.router = (0, express_1.Router)();
        this.AnswerService = new answer_service_1.default();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.body;
                const userId = req.user._id;
                const { message, success, answer } = yield this.AnswerService.createAnswer(dto, userId);
                res.status(201).json({
                    message,
                    success,
                    answer
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.answer = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { answerId } = req.params;
                const { message, success, answer } = yield this.AnswerService.getAnswer(answerId);
                res.status(200).json({
                    message,
                    success,
                    answer
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.body;
                const { answerId } = req.params;
                const { answer, message, success } = yield this.AnswerService.updateAnswer(answerId, dto);
                res.status(200).json({
                    message,
                    success,
                    answer
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { answerId } = req.params;
                const { message, success } = yield this.AnswerService.deleteAnswer(answerId);
                res.status(200).json({
                    message,
                    success
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}`, authenticated_middleware_1.default, this.create);
        this.router.route(`${this.path}/:answerId`)
            .get(authenticated_middleware_1.default, this.answer)
            .delete(authenticated_middleware_1.default, this.delete)
            .put(authenticated_middleware_1.default, this.update);
    }
}
exports.default = AnswerController;
