import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
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

export const CowController = {
  createCow,
  getSingleCow,
};
