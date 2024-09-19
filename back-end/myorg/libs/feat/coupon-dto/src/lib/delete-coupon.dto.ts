import { z } from 'zod';

export const DeleteCouponPathParamSchema = z.coerce.number().int().positive();
export type DeleteCouponPathParam = z.infer<typeof DeleteCouponPathParamSchema>;

export const DeleteCouponResponseSchema = z.undefined();
export type DeleteCouponResponse = z.infer<typeof DeleteCouponResponseSchema>;
