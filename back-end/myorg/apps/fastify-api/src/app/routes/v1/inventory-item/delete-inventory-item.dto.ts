import { z } from 'zod';

export const DeleteInventoryItemPathParamSchema = z.coerce
  .number()
  .int()
  .positive();
export type DeleteInventoryItemPathParam = z.infer<
  typeof DeleteInventoryItemPathParamSchema
>;

export const DeleteInventoryItemResponseSchema = z.undefined();
export type DeleteInventoryItemResponse = z.infer<
  typeof DeleteInventoryItemResponseSchema
>;
