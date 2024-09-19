import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const CreateProductRequestSchema = z
  .object({
    name: z.string(),
    price: coerceDecimalSchema,
    description: z.string().nullable().optional(),
  })
  .strict();
export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;

export const CreateProductResponseSchema = z
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
export type CreateProductResponse = z.infer<typeof CreateProductResponseSchema>;
