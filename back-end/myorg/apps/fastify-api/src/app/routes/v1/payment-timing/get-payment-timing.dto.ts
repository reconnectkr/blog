import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetPaymentTimingPathParamSchema = z.coerce.number().int();
export type GetPaymentTimingPathParam = z.infer<
  typeof GetPaymentTimingPathParamSchema
>;

export const GetPaymentTimingResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
export type GetPaymentTimingResponse = z.infer<
  typeof GetPaymentTimingResponseSchema
>;
