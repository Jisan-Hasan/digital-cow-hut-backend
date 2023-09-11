import { Model } from 'mongoose';

type IUserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  password: string;
  role: 'buyer' | 'seller';
  name: IUserName;
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
};

export type UserModel = Model<IUser, Record<string, unknown>>;
