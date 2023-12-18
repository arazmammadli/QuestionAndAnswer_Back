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
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const auth_service_1 = __importDefault(require("@/services/auth.service"));
class AuthController {
    constructor() {
        this.path = "/auth";
        this.router = (0, express_1.Router)();
        this.AuthService = new auth_service_1.default();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.body;
                const { user, token, success } = yield this.AuthService.register(dto);
                res
                    .status(201)
                    .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 10 })
                    .json({
                    user,
                    token,
                    success
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.body;
                const { user, token, success } = yield this.AuthService.login(dto);
                res
                    .status(200)
                    .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 10 })
                    .json({
                    user,
                    token,
                    success
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cookies = req.cookies;
                if (!cookies.accessToken) {
                    throw new Error("No content");
                }
                ;
                // Clear the accessToken cookie with secure and httpOnly options
                res.clearCookie("accessToken", { httpOnly: true, sameSite: 'none', secure: true });
                // Send a JSON response indicating success
                res.json({ message: "Cookie cleared", success: true });
            }
            catch (error) {
                next(new http_exception_1.default(204, error.message));
            }
        });
        this.initialiseRoutes();
    }
    ;
    initialiseRoutes() {
        this.router.post(`${this.path}/register`, this.register);
        this.router.post(`${this.path}/login`, this.login);
        this.router.post(`${this.path}/logout`, this.logout);
    }
    ;
}
exports.default = AuthController;
