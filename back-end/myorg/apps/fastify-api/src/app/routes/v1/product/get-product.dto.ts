import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const GetProductPathParamSchema = z.coerce.number().int();
export type GetProductPathParam = z.infer<typeof GetProductPathParamSchema>;

export const GetProductResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    price: coerceDecimalSchema,
    description: z.string().nullable(),

    createdAt: z.coerce.date(),
    createdBy: z.string(),
    updatedAt: z.coerce.date(),
    updatedBy: z.string(),
  })
  .strict();
export type GetProductResponse = z.infer<typeof GetProductResponseSchema>;
