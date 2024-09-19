import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetInventoryEventTypePathParamSchema = z.coerce.number().int();
export type GetInventoryEventTypePathParam = z.infer<
  typeof GetInventoryEventTypePathParamSchema
>;

export const GetInventoryEventTypeResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
export type GetInventoryEventTypeResponse = z.infer<
  typeof GetInventoryEventTypeResponseSchema
>;
