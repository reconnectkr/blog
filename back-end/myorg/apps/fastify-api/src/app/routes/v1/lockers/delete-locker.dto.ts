import { z } from 'zod';

export const DeleteLockerPathParamSchema = z.coerce.number().int().positive();
export type DeleteLockerPathParam = z.infer<typeof DeleteLockerPathParamSchema>;

export const DeleteLockerResponseSchema = z.undefined();
export type DeleteLockerResponse = z.infer<typeof DeleteLockerResponseSchema>;
