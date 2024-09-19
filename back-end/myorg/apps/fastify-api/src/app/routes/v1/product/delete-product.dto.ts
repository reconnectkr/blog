import { z } from 'zod';

export const DeleteProductPathParamSchema = z.coerce.number().int().positive();
export type DeleteProductPathParam = z.infer<
  typeof DeleteProductPathParamSchema
>;

export const DeleteProductResponseSchema = z.undefined();
export type DeleteProductResponse = z.infer<typeof DeleteProductResponseSchema>;
