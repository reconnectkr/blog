import { z } from 'zod';

export const DeleteProductInventoryItemPathParamSchema = z.coerce
  .number()
  .int()
  .positive();
export type DeleteProductInventoryItemPathParam = z.infer<
  typeof DeleteProductInventoryItemPathParamSchema
>;

export const DeleteProductInventoryItemResponseSchema = z.undefined();
export type DeleteProductInventoryItemResponse = z.infer<
  typeof DeleteProductInventoryItemResponseSchema
>;
