import { z } from 'zod';

// WIP
export const DeletePointOfSaleProductPathParamSchema = z.coerce
  .number()
  .int()
  .positive();
export type DeletePointOfSaleProductPathParam = z.infer<
  typeof DeletePointOfSaleProductPathParamSchema
>;

export const DeletePointOfSaleProductResponseSchema = z.undefined();
export type DeletePointOfSaleProductResponse = z.infer<
  typeof DeletePointOfSaleProductResponseSchema
>;
