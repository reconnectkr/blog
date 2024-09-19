import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetPriceAdjustmentTypePathParamSchema = z.coerce.number().int();
export type GetPriceAdjustmentTypePathParam = z.infer<
  typeof GetPriceAdjustmentTypePathParamSchema
>;

export const GetPriceAdjustmentTypeResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
export type GetPriceAdjustmentTypeResponse = z.infer<
  typeof GetPriceAdjustmentTypeResponseSchema
>;
