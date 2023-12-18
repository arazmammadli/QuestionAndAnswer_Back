"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterDto = void 0;
const class_validator_1 = require("class-validator");
class UserRegisterDto {
}
exports.UserRegisterDto = UserRegisterDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Name cannot be empty" }),
    (0, class_validator_1.IsString)({ message: "Name must be a string" }),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50, { message: 'name must be at most 50 characters long' }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Surname cannot be empty" }),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.IsString)({ message: "Surname must be a string" }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "surname", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Email cannot be empty" }),
    (0, class_validator_1.IsEmail)({}, { message: "Wrong email!" }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password cannot be empty" }),
    (0, class_validator_1.IsString)({ message: "Password must be a string" }),
    (0, class_validator_1.MinLength)(6, { message: 'password must be at least 6 characters long' }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "password", void 0);
