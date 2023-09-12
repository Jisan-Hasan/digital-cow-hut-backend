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
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const cow_model_1 = require("../cow/cow.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const buyer = yield user_model_1.User.findById(payload.buyer);
    const cow = yield cow_model_1.Cow.findById(payload.cow);
    //   check is the cow is available for sell
    if ((cow === null || cow === void 0 ? void 0 : cow.label) === 'sold out') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'This cow is already sold out');
    }
    //   check for buyer and seller
    if (!buyer) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Buyer not found');
    }
    if (!cow) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cow not found');
    }
    //   check if buyer have enough money
    if ((buyer === null || buyer === void 0 ? void 0 : buyer.budget) < (cow === null || cow === void 0 ? void 0 : cow.price)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Buyer have not enough money');
    }
    //   start session
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // update cow label
        const updatedCow = yield cow_model_1.Cow.findByIdAndUpdate(payload.cow, {
            label: 'sold out',
        }, { new: true, session });
        if (!updatedCow) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cow label can't be updated! Try again");
        }
        // decrease buyer balance
        const updatedBuyer = yield user_model_1.User.findByIdAndUpdate(payload.buyer, {
            budget: buyer.budget - cow.price,
        }, { new: true, session });
        if (!updatedBuyer) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Buyer balance can't be updated! Try again");
        }
        // find seller increase seller balance
        const seller = yield user_model_1.User.findById(cow.seller).session(session);
        if (!seller) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Seller not found');
        }
        const updatedSeller = yield user_model_1.User.findByIdAndUpdate(seller === null || seller === void 0 ? void 0 : seller._id, { income: seller.income + cow.price }, { new: true, session });
        if (!updatedSeller) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Can't update seller balance! Try again");
        }
        const order = yield order_model_1.Order.create([payload], { session });
        if (!order.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Order creation failed! Try again');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return order[0];
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find({}).populate('cow').populate('buyer');
    return result;
});
exports.OrderService = {
    createOrder,
    getAllOrders,
};
