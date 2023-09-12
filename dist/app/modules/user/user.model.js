"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("./user.constant");
exports.UserSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: user_constant_1.role,
        required: true,
    },
    name: {
        type: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        default: 0,
    },
    income: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.User = (0, mongoose_1.model)('User', exports.UserSchema);
