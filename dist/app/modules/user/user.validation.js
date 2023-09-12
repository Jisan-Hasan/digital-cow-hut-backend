"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const user_constant_1 = require("../user/user.constant");
const updateUserZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        password: zod_1.default.string().optional(),
        role: zod_1.default.enum([...user_constant_1.role]).optional(),
        name: zod_1.default
            .object({
            firstName: zod_1.default.string().optional(),
            lastName: zod_1.default.string().optional(),
        })
            .optional(),
        phoneNumber: zod_1.default.string().optional(),
        address: zod_1.default.string().optional(),
        budget: zod_1.default.number().optional(),
        income: zod_1.default.number().optional(),
    }),
});
exports.UserValidation = {
    updateUserZodSchema,
};
