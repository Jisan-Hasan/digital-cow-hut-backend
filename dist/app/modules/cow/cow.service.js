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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const cow_constant_1 = require("./cow.constant");
const cow_model_1 = require("./cow.model");
const createCow = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield cow_model_1.Cow.create(payload)).populate('seller');
    return result;
});
const getSingleCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id).populate('seller');
    return result;
});
const getAllCows = (filters, paginationOptions, priceFilters) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.PaginationHelpers.calculatePagination(paginationOptions);
    const { minPrice, maxPrice } = priceFilters;
    const andConditions = [];
    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: cow_constant_1.cowSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    // Filters needs $and to fullfil all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: { $regex: new RegExp(`^${value}$`, 'i') },
            })),
        });
    }
    // Dynamic  Sort needs  field to  do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // filter with price
    if (minPrice) {
        andConditions.push({ price: { $gte: Number(minPrice) } });
    }
    if (maxPrice) {
        andConditions.push({ price: { $lte: Number(maxPrice) } });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield cow_model_1.Cow.find(whereConditions)
        .populate('seller')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield cow_model_1.Cow.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateCow = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate('seller');
    return result;
});
const deleteCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findByIdAndDelete(id).populate('seller');
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cow not found');
    }
    return result;
});
exports.CowService = {
    createCow,
    getSingleCow,
    getAllCows,
    updateCow,
    deleteCow,
};
