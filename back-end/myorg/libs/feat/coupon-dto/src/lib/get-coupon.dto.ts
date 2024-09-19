import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetCouponPathParamSchema = z.coerce.number().int().positive();
export type GetCouponPathParam = z.infer<typeof GetCouponPathParamSchema>;

export const GetCouponResponseSchema = z
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
export type GetCouponResponse = z.infer<typeof GetCouponResponseSchema>;
