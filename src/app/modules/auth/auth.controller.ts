import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../user/user.interface';
import { AuthService } from './auth.service';

const signUpUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.signUpUser(req.body);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User signup successful',
      data: result,
    });
  },
);

export const AuthController = {
  signUpUser,
};
