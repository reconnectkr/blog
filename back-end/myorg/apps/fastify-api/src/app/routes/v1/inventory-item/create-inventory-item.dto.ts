import { z } from 'zod';

export const CreateInventoryItemRequestSchema = z
  .object({
    code: z.string(),
    name: z.string(),
    specification: z.string(),
    manufacturer: z.string(),
    inventoryUnitId: z.coerce.number().int(),
    description: z.string().nullable().optional(),
    barcode: z.string().nullable().optional(),
    active: z.boolean().optional(),
    categoryId: z.coerce.number().int().nullable().optional(),
  })
  .strict();
export type CreateInventoryItemRequest = z.infer<
  typeof CreateInventoryItemRequestSchema
>;

export const CreateInventoryItemResponseSchema = z
  .object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    specification: z.string(),
    manufacturer: z.string(),
    inventoryUnitId: z.number().int(),
    description: z.string().nullable(),
    barcode: z.string().nullable(),
    active: z.boolean(),
    categoryId: z.coerce.number().int().nullable(),
    createdAt: z.coerce.date(),
    createdBy: z.string(),
    updatedAt: z.coerce.date(),
    updatedBy: z.string(),
  })
  .strict();
export type CreateInventoryItemResponse = z.infer<
  typeof CreateInventoryItemResponseSchema
>;
