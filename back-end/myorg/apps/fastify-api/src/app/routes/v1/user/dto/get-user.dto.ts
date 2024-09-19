import { z } from 'zod';

export const GetUserPathParamSchema = z.string();
export type GetUserPathParam = z.infer<typeof GetUserPathParamSchema>;

export const GetUserResponseSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    mobile: z.string().nullable(),
    photo: z.string().url().nullable(),
    departmentId: z.number().nullable(),
  })
  .strict();
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
