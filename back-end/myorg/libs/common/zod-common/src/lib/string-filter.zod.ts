import { z } from 'zod';

// StringFilter schema
export const StringFilterSchema = z.object({
  equals: z.string().optional(),
  in: z.array(z.string()).optional(),
  notIn: z.array(z.string()).optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.string().optional(),
});

// StringNullableFilter schema
export const StringNullableFilterSchema = z.object({
  equals: z.string().nullable().optional(),
  in: z.array(z.string()).nullable().optional(),
  notIn: z.array(z.string()).nullable().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.string().nullable().optional(),
});

// Type inference
export type StringFilter = z.infer<typeof StringFilterSchema>;
export type StringNullableFilter = z.infer<typeof StringNullableFilterSchema>;
