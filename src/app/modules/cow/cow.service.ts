import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { PaginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { cowSearchableFields } from './cow.constant';
import { ICow, ICowFilters, IPriceFilters } from './cow.interface';
import { Cow } from './cow.model';

const createCow = async (payload: ICow): Promise<ICow> => {
  const result = (await Cow.create(payload)).populate('seller');

  return result;
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller');

  return result;
};

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions,
  priceFilters: IPriceFilters,
): Promise<IGenericResponse<ICow[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelpers.calculatePagination(paginationOptions);
  const { minPrice, maxPrice } = priceFilters;

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
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
        [field]: value,
      })),
    });
  }

  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
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

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>,
): Promise<ICow | null> => {
  const result = await Cow.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('seller');

  return result;
};

const deleteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id).populate('seller');

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow not found');
  }

  return result;
};

export const CowService = {
  createCow,
  getSingleCow,
  getAllCows,
  updateCow,
  deleteCow,
};
