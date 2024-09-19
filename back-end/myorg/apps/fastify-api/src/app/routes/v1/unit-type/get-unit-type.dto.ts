import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetUnitTypePathParamSchema = z.coerce.number().int();
export type GetUnitTypePathParam = z.infer<typeof GetUnitTypePathParamSchema>;

export const GetUnitTypeResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
  })
  .strict();
export type GetUnitTypeResponse = z.infer<typeof GetUnitTypeResponseSchema>;
