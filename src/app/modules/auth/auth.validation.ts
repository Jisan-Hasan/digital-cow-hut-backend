import z from 'zod';
import { role } from '../user/user.constant';

const signUpUserZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'Password is required' }),
    role: z.enum([...role] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    name: z.object({
      firstName: z.string({ required_error: 'First Name is required' }),
      lastName: z.string({ required_error: 'Last Name is required' }),
    }),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    address: z.string({ required_error: 'Address number is required' }),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

export const AuthValidation = {
  signUpUserZodSchema,
};
