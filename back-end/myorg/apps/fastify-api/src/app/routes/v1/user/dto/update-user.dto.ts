import { z } from 'zod';

export const UpdateUserPathParamSchema = z.string();
export type UpdateUserPathParam = z.infer<typeof UpdateUserPathParamSchema>;

export const UpdateUserRequestSchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    name: z.string().optional(),
    mobile: z.string().nullable().optional(),
    photo: z.string().url().nullable().optional(),
    departmentId: z.coerce.number().int().nullable().optional(),
    active: z.boolean().optional(),
  })
  .strict();
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const UpdateUserResponseSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    name: z.string(),
    mobile: z.string().nullable(),
    photo: z.string().url().nullable(),
    departmentId: z.number().int().nullable(),
    active: z.boolean(),
  })
  .strict();
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;
