import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const UpdateCouponPathParamSchema = z.coerce.number().int();
export type UpdateCouponPathParam = z.infer<typeof UpdateCouponPathParamSchema>;

export const UpdateCouponRequestSchema = z
  .object({
    retrievedAt: z.coerce.date().nullable().optional(),
    retrievedBy: z.string().nullable().optional(),
  })
  .strict();
export type UpdateCouponRequest = z.infer<typeof UpdateCouponRequestSchema>;

export const UpdateCouponResponseSchema = z
  .object({
    id: z.number(),
    code: z.string(),
    issuedBy: z.string(),
    issuedAt: z.coerce.date(),
    expiredAt: z.coerce.date(),
    price: coerceDecimalSchema.nullable().optional(),
    rate: coerceDecimalSchema.nullable().optional(),
    retrievedAt: z.coerce.date().nullable().optional(),
    retrievedBy: z.string().nullable().optional(),
  })
  .strict();
export type UpdateCouponResponse = z.infer<typeof UpdateCouponResponseSchema>;
