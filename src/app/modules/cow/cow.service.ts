import { ICow } from './cow.interface';
import { Cow } from './cow.model';

const createCow = async (payload: ICow): Promise<ICow> => {
  const result = (await Cow.create(payload)).populate('seller');

  return result;
};

export const CowService = { createCow };
