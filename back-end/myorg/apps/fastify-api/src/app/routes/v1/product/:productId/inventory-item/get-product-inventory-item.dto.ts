import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const ProductIdPathParamSchema = z.coerce.number().int();
export type ProductIdPathParam = z.infer<typeof ProductIdPathParamSchema>;

export const InventoryItemIdPathParamSchema = z.coerce.number().int();
export type InventoryItemIdPathParam = z.infer<
  typeof InventoryItemIdPathParamSchema
>;

export const GetProductInventoryItemResponseSchema = z
  .object({
    productId: z.number().int(),
    inventoryItem: z.object({
      id: z.number().int(),
      code: z.string(),
      name: z.string(),
      specification: z.string(),
      inventoryUnit: z.object({
        id: z.number().int(),
        name: z.string(),
      }),
      category: z
        .object({
          id: z.number().int(),
          name: z.string(),
          typeId: z.number().int(),
          parentId: z.number().int().nullable(),
        })
        .nullable(),
    }),
    quantity: coerceDecimalSchema,

    createdAt: z.coerce.date(),
    createdBy: z.string(),
    updatedAt: z.coerce.date(),
    updatedBy: z.string(),
  })
  .strict();
export type GetProductInventoryItemResponse = z.infer<
  typeof GetProductInventoryItemResponseSchema
>;
