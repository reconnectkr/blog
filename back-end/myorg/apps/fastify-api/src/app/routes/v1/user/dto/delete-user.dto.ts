import { z } from 'zod';

export const DeleteUserPathParamSchema = z.string();
export type DeleteUserPathParam = z.infer<typeof DeleteUserPathParamSchema>;

export const DeleteUserResponseSchema = z.undefined();
export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;
