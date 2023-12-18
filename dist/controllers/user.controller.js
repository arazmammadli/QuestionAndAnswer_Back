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
const user_service_1 = __importDefault(require("@/services/user.service"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
class UserController {
    constructor() {
        this.path = "/user";
        this.router = (0, express_1.Router)();
        this.UserService = new user_service_1.default();
        this.users = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryDto = req.query;
                const { message, success, users, totalUsers, pageQuery } = yield this.UserService.getUsers(queryDto);
                res.status(200).json({
                    message,
                    success,
                    users,
                    count: totalUsers,
                    page: pageQuery
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.profile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                const { message, success, user } = yield this.UserService.getProfile(userId);
                res.status(200).json({
                    message,
                    success,
                    user
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.user = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { message, success, user } = yield this.UserService.getUser(userId);
                res.status(200).json({
                    message,
                    success,
                    user
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.body;
                const userId = req.user._id;
                const { message, success, updatedUser } = yield this.UserService.updateUser(userId, dto);
                res.status(200).json({
                    message,
                    success,
                    user: updatedUser
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                const { message, success } = yield this.UserService.deleteUser(userId);
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
    ;
    initialiseRoutes() {
        this.router.route(`${this.path}`)
            .get(this.users)
            .put(authenticated_middleware_1.default, this.update)
            .delete(authenticated_middleware_1.default, this.delete);
        this.router.get(`${this.path}/profile`, authenticated_middleware_1.default, this.profile);
        this.router.get(`${this.path}/:userId`, this.user);
    }
    ;
}
exports.default = UserController;
