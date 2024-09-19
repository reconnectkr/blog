import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const CreatePointOfSaleProductRequestSchema = z
  .object({
    // pointOfSaleId: z.coerce.number(),
    productId: z.coerce.number(),
  })
  .strict();
export type CreatePointOfSaleProductRequest = z.infer<
  typeof CreatePointOfSaleProductRequestSchema
>;

export const CreatePointOfSaleProductResponseSchema = z
  .object({
    product: z.object({
      id: z.number().int(),
      name: z.string(),
      price: coerceDecimalSchema,
      description: z.string().nullable(),
    }),
    createdAt: z.coerce.date(),
    createdBy: z.string(),
  })
  .strict();
export type CreatePointOfSaleProductResponse = z.infer<
  typeof CreatePointOfSaleProductResponseSchema
>;
