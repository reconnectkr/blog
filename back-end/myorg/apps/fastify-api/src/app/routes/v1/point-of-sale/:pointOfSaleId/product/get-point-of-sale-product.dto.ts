import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const PointOfSaleIdPathParamSchema = z.coerce.number().int();
export type PointOfSaleIdPathParam = z.infer<
  typeof PointOfSaleIdPathParamSchema
>;
export const ProductIdPathParamSchema = z.coerce.number().int();
export type ProductIdPathParam = z.infer<typeof ProductIdPathParamSchema>;

export const GetPointOfSaleProductResponseSchema = z
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
export type GetPointOfSaleProductResponse = z.infer<
  typeof GetPointOfSaleProductResponseSchema
>;
