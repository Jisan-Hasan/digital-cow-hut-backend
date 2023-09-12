import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (payload: IOrder) => {
  const buyer = await User.findById(payload.buyer);
  const cow = await Cow.findById(payload.cow);

  //   check is the cow is available for sell
  if (cow?.label === 'sold out') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This cow is already sold out');
  }

  //   check for buyer and seller
  if (!buyer) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer not found');
  }
  if (!cow) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow not found');
  }

  //   check if buyer have enough money
  if (buyer?.budget < cow?.price) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer have not enough money');
  }

  //   start session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // update cow label
    const updatedCow = await Cow.findByIdAndUpdate(
      payload.cow,
      {
        label: 'sold out',
      },
      { new: true, session },
    );
    if (!updatedCow) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cow label can't be updated! Try again",
      );
    }

    // decrease buyer balance
    const updatedBuyer = await User.findByIdAndUpdate(
      payload.buyer,
      {
        budget: buyer.budget - cow.price,
      },
      { new: true, session },
    );
    if (!updatedBuyer) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Buyer balance can't be updated! Try again",
      );
    }

    // find seller increase seller balance
    const seller = await User.findById(cow.seller).session(session);
    if (!seller) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Seller not found');
    }
    const updatedSeller = await User.findByIdAndUpdate(
      seller?._id,
      { income: seller.income + cow.price },
      { new: true, session },
    );

    if (!updatedSeller) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Can't update seller balance! Try again",
      );
    }

    const order = await Order.create([payload], { session });
    if (!order) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Order creation failed! Try again',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const OrderService = {
  createOrder,
};
