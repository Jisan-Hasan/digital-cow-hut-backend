import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { OrderService } from './order.service';

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderService.createOrder(req.body);

    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order placed successfully',
      data: result,
    });
  },
);

const getAllOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderService.getAllOrders();

    sendResponse<IOrder[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders retrieved successfully',
      data: result,
    });
  },
);

export const OrderController = {
  createOrder,
  getAllOrders,
};
