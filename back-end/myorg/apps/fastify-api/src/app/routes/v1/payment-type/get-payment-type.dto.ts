import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetPaymentTypePathParamSchema = z.coerce.number().int();
export type GetPaymentTypePathParam = z.infer<
  typeof GetPaymentTypePathParamSchema
>;

export const GetPaymentTypeResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
export type GetPaymentTypeResponse = z.infer<
  typeof GetPaymentTypeResponseSchema
>;
