"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const user_constant_1 = require("../user/user.constant");
const signUpUserZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        password: zod_1.default.string({ required_error: 'Password is required' }),
        role: zod_1.default.enum([...user_constant_1.role], {
            required_error: 'Role is required',
        }),
        name: zod_1.default.object({
            firstName: zod_1.default.string({ required_error: 'First Name is required' }),
            lastName: zod_1.default.string({ required_error: 'Last Name is required' }),
        }),
        phoneNumber: zod_1.default.string({ required_error: 'Phone number is required' }),
        address: zod_1.default.string({ required_error: 'Address number is required' }),
        budget: zod_1.default.number().optional(),
        income: zod_1.default.number().optional(),
    }),
});
exports.AuthValidation = {
    signUpUserZodSchema,
};
