import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { cowFilterableFields } from './cow.constant';
import { ICow } from './cow.interface';
import { CowService } from './cow.service';

const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CowService.createCow(req.body);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow created successfully',
      data: result,
    });
  },
);

const getSingleCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CowService.getSingleCow(req.params.id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow retrieved successfully',
      data: result,
    });
  },
);

const getAllCows: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, cowFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const priceFilters = pick(req.query, ['minPrice', 'maxPrice']);

    const result = await CowService.getAllCows(
      filters,
      paginationOptions,
      priceFilters,
    );

    sendResponse<ICow[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cows retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

const updateCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CowService.updateCow(req.params.id, req.body);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow updated successfully',
      data: result,
    });
  },
);

const deleteCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CowService.deleteCow(req.params.id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cow deleted successfully',
      data: result,
    });
  },
);

export const CowController = {
  createCow,
  getSingleCow,
  getAllCows,
  updateCow,
  deleteCow,
};
