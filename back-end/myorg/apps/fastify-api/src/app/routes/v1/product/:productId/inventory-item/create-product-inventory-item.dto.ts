import { coerceDecimalSchema } from '@reconnect/zod-common';
import { z } from 'zod';

export const CreateProductInventoryItemRequestSchema = z
  .object({
    // productId: z.coerce.number(),
    inventoryItemId: z.coerce.number(),
    quantity: coerceDecimalSchema,
  })
  .strict();
export type CreateProductInventoryItemRequest = z.infer<
  typeof CreateProductInventoryItemRequestSchema
>;

export const CreateProductInventoryItemResponseSchema = z
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
export type CreateProductInventoryItemResponse = z.infer<
  typeof CreateProductInventoryItemResponseSchema
>;
