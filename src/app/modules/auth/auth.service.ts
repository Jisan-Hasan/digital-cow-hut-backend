import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const signUpUser = async (payload: IUser): Promise<IUser> => {
  const result = await User.create(payload);
  return result;
};

export const AuthService = { signUpUser };
