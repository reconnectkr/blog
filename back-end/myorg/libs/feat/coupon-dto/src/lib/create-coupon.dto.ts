import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const CreateCouponRequestSchema = z
  .object({
    code: z.string(),
    issuedAt: z.coerce.date(),
    expiredAt: z.coerce.date(),
    price: coerceDecimalSchema.nullable().optional(),
    rate: coerceDecimalSchema.nullable().optional(),
    retrievedAt: z.coerce.date().nullable().optional(),
    retrievedBy: z.string().nullable().optional(),
  })
  .strict();
export type CreateCouponRequest = z.infer<typeof CreateCouponRequestSchema>;

export const CreateCouponResponseSchema = z
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
export type CreateCouponResponse = z.infer<typeof CreateCouponResponseSchema>;
