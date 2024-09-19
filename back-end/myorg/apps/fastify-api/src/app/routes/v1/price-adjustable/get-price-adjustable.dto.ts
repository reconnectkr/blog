import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetPriceAdjustablePathParamSchema = z.coerce.number().int();
export type GetPriceAdjustablePathParam = z.infer<
  typeof GetPriceAdjustablePathParamSchema
>;

export const GetPriceAdjustableResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
export type GetPriceAdjustableResponse = z.infer<
  typeof GetPriceAdjustableResponseSchema
>;
