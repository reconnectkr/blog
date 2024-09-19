import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const UpdateProductPathParamSchema = z.coerce.number().int();
export type UpdateProductPathParam = z.infer<
  typeof UpdateProductPathParamSchema
>;

export const UpdateProductRequestSchema = z
  .object({
    name: z.string().optional(),
    price: coerceDecimalSchema.optional(),
    description: z.string().nullable().optional(),
  })
  .strict();
export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>;

export const UpdateProductResponseSchema = z
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
export type UpdateProductResponse = z.infer<typeof UpdateProductResponseSchema>;
