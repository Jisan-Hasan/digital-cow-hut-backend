import z from 'zod';
import { role } from '../user/user.constant';

const updateUserZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    role: z.enum([...role] as [string, ...string[]]).optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

export const UserValidation = {
  updateUserZodSchema,
};
