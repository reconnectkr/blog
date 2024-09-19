import { z } from 'zod';

export const AscendingDecendingSchema = z.enum(['asc', 'desc']);
export const NullableSortOrderSchema = z.object({
  sort: AscendingDecendingSchema,
  nulls: z.enum(['first', 'last']).optional(),
});
