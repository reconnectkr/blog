import { z } from 'zod';

export const DeletePostPathParamSchema = z.coerce.number().int().positive();
export type DeletePostPathParam = z.infer<typeof DeletePostPathParamSchema>;

export const DeletePostResponseSchema = z.undefined();
export type DeletePostResponse = z.infer<typeof DeletePostResponseSchema>;
