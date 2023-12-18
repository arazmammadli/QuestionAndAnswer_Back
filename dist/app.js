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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_options_1 = require("@/config/cors.options");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const dbConnection_1 = require("@/config/dbConnection");
const cloudinary_1 = require("cloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
class App {
    constructor(controllers, port) {
        this.port = port;
        this.express = (0, express_1.default)();
        this.initialiseCloudinaryConfig();
        this.useDatabaseConnection();
        this.useMiddleware();
        this.useControllers(controllers);
        this.useErrorHandling();
    }
    ;
    initialiseCloudinaryConfig() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
    useMiddleware() {
        this.express.use((0, cors_1.default)(cors_options_1.corsOptions));
        this.express.use(express_1.default.json({ limit: "10mb" }));
        this.express.use((0, cookie_parser_1.default)());
        this.express.use(express_1.default.urlencoded({ extended: false }));
    }
    ;
    useControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use("/api", controller.router);
        });
    }
    ;
    useErrorHandling() {
        this.express.use(error_middleware_1.default);
    }
    ;
    useDatabaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, dbConnection_1.connectDB)();
            }
            catch (err) {
                console.error("Database connection error:", err);
            }
        });
    }
    ;
    listen() {
        mongoose_1.default.connection.once("open", () => {
            console.log("Connected to Mongo DB");
            this.express.listen(this.port, () => {
                console.log(`server running on ${this.port} port.`);
            });
        });
    }
}
;
exports.default = App;
