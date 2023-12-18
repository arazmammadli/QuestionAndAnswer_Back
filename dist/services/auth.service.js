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
const user_schema_1 = __importDefault(require("@/models/user.schema"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const token_1 = __importDefault(require("@/utils/token"));
const bcrypt_1 = require("bcrypt");
class AuthService {
    constructor() {
        this.user = user_schema_1.default;
    }
    register(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.user.findOne({
                    $or: [
                        { email: dto.email }
                    ]
                });
                const uniqueFields = ["email"];
                const messages = [];
                if (existingUser) {
                    for (const value of uniqueFields) {
                        if (existingUser[value] === dto[value]) {
                            messages.push(`${value} already exists`);
                        }
                    }
                    if (messages.length > 0) {
                        throw new http_exception_1.default(409, messages.join(","));
                    }
                }
                const newUser = yield this.user.create(dto);
                const user = yield this.user.findById(newUser.id).populate("questions");
                const accessToken = token_1.default.createToken(newUser.id);
                return {
                    success: true,
                    user: this.generateAuthFields(user),
                    token: accessToken,
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    login(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.validateUser(dto);
                const generateToken = token_1.default.createToken(user.id);
                return {
                    success: true,
                    user: this.generateAuthFields(user),
                    token: generateToken
                };
            }
            catch (error) {
                throw new Error("Unable to create user.");
            }
        });
    }
    validateUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.user.findOne({
                $or: [{ email: dto.email }]
            }).populate("questions").exec();
            if (!user) {
                throw new Error("Unable to find user with that email address");
            }
            const match = yield (0, bcrypt_1.compare)(dto.password, user.password);
            if (!match) {
                throw new Error("Invalid credentials");
            }
            return user;
        });
    }
    generateAuthFields(user) {
        const { email, name, surname, img, questions } = user;
        return { email, name, surname, img, questions };
    }
}
;
exports.default = AuthService;
