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
const comment_service_1 = __importDefault(require("@/services/comment.service"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
class CommentController {
    constructor() {
        this.path = "/comment";
        this.router = (0, express_1.Router)();
        this.CommentService = new comment_service_1.default();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.body;
                const userId = req.user._id;
                const { message, success, newComment } = yield this.CommentService.createComment(dto, userId);
                res.status(201).json({
                    message,
                    success,
                    comment: newComment
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.comments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionId } = req.params;
                const { message, success, data } = yield this.CommentService.getComments(questionId);
                res.status(200).json({
                    message,
                    success,
                    data
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, questionId } = req.params;
                const { message, success } = yield this.CommentService.deleteComment(id, questionId);
                success ? res.status(200).json({
                    success,
                    message
                }) : res.status(404).json({
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
    ;
    initialiseRoutes() {
        this.router.post(`${this.path}`, authenticated_middleware_1.default, this.create);
        this.router.get(`${this.path}/:questionId`, this.comments);
        this.router.delete(`${this.path}/:id/:questionId`, authenticated_middleware_1.default, this.delete);
    }
}
exports.default = CommentController;
