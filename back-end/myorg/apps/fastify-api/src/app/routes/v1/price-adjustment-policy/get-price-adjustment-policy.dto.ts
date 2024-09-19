import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetPriceAdjustmentPolicyPathParamSchema = z.coerce.number().int();
export type GetPriceAdjustmentPolicyPathParam = z.infer<
  typeof GetPriceAdjustmentPolicyPathParamSchema
>;

export const GetPriceAdjustmentPolicyResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
  })
  .strict();
export type GetPriceAdjustmentPolicyResponse = z.infer<
  typeof GetPriceAdjustmentPolicyResponseSchema
>;
