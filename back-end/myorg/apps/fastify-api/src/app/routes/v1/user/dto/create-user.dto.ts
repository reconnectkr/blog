import { z } from 'zod';

export const CreateUserRequestSchema = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
    name: z.string(),
    mobile: z.string(),
    photo: z.string().url().nullable().optional(),
    departmentId: z.number().nullable().optional(),
  })
  .strict();
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const CreateUserResponseSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    name: z.string(),
    mobile: z.string().nullable(),
    photo: z.string().url().nullable(),
    departmentId: z.number().nullable(),
  })
  .strict();
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
