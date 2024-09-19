import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetPaymentMethodPathParamSchema = z.coerce.number().int();
export type GetPaymentMethodPathParam = z.infer<
  typeof GetPaymentMethodPathParamSchema
>;

export const GetPaymentMethodResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
export type GetPaymentMethodResponse = z.infer<
  typeof GetPaymentMethodResponseSchema
>;
