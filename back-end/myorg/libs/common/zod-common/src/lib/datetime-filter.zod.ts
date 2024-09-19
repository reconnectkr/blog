import { z } from 'zod';

// DateTimeIntervalFilter schema
export const DateTimeIntervalFilterSchema = z.object({
  startDateTimeInclusive: z.string().optional(), // iso8601
  endDateTimeExclusive: z.string().optional(), // iso8601
});

// DateTimeFilter schema
export const DateTimeFilterSchema = z.object({
  equals: z.coerce.date().optional(),
  in: z.array(z.coerce.date()).optional(),
  notIn: z.array(z.coerce.date()).optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.coerce.date().optional(),
});

// DateTimeNullableFilter schema
export const DateTimeNullableFilterSchema = z.object({
  equals: z.coerce.date().nullable().optional(),
  in: z.array(z.coerce.date()).nullable().optional(),
  notIn: z.array(z.coerce.date()).nullable().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.coerce.date().nullable().optional(),
});

// Type definitions
export type DateTimeIntervalFilter = z.infer<
  typeof DateTimeIntervalFilterSchema
>;
export type DateTimeFilter = z.infer<typeof DateTimeFilterSchema>;
export type DateTimeNullableFilter = z.infer<
  typeof DateTimeNullableFilterSchema
>;
