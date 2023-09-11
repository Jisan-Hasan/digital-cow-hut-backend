/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from './user.interface';
import { User } from './user.model';

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find({});

  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);

  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
): Promise<IUser | null> => {
  const { name, ...userData } = payload;
  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await User.findByIdAndUpdate(id, updatedUserData, {
    new: true,
  });

  return result;
};

export const UserService = { getAllUsers, getSingleUser, updateUser };
