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
const tag_service_1 = __importDefault(require("@/services/tag.service"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
// İşimə görə Tag-in back-ni yazdım amma front-nu çatdıra bilmədim ona görə istifadə eləməmişəm
class TagController {
    constructor() {
        this.path = "/tag";
        this.router = (0, express_1.Router)();
        this.TagService = new tag_service_1.default();
        this.tags = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryDto = req.query;
                const { tags, totalTags, success, pageQuery } = yield this.TagService.getTags(queryDto);
                res.status(200).json({
                    tags,
                    count: totalTags,
                    success,
                    pageQuery
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = req.body;
                const { message, tag } = yield this.TagService.createTag(dto);
                res.status(201).json({
                    tag,
                    message: message,
                    success: true
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
                const { message, success, updatedTag } = yield this.TagService.updateTag(id, dto);
                res.status(200).json({
                    message,
                    success,
                    updatedTag
                });
            }
            catch (err) {
                next(new http_exception_1.default(400, err.message));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { message, success } = yield this.TagService.deleteTag(id);
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
            .post(authenticated_middleware_1.default, this.create)
            .get(this.tags);
        this.router.delete(`${this.path}/:id`, authenticated_middleware_1.default, this.delete);
        this.router.put(`${this.path}/:id`, authenticated_middleware_1.default, this.update);
    }
}
exports.default = TagController;
