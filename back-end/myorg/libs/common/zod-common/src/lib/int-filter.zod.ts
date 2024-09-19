import { z } from 'zod';

// Helper function to create a number schema with custom error message
const numberWithMessage = (fieldName: string) =>
  z.coerce.number({
    invalid_type_error: `${fieldName} must be a number`,
    required_error: `${fieldName} is required`,
  });

// Helper function to create an array of numbers schema with custom error message
const numberArrayWithMessage = (fieldName: string) =>
  z.array(z.coerce.number(), {
    invalid_type_error: `${fieldName} must be an array of numbers`,
    required_error: `${fieldName} is required`,
  });

// IntFilter schema
export const IntFilterSchema = z
  .object({
    equals: numberWithMessage('equals').optional(),
    in: numberArrayWithMessage('in').optional(),
    notIn: numberArrayWithMessage('notIn').optional(),
    lt: numberWithMessage('lt').optional(),
    lte: numberWithMessage('lte').optional(),
    gt: numberWithMessage('gt').optional(),
    gte: numberWithMessage('gte').optional(),
    not: numberWithMessage('not').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one filter condition must be provided',
  });

// IntNullableFilter schema
export const IntNullableFilterSchema = z
  .object({
    equals: numberWithMessage('equals').nullable().optional(),
    in: numberArrayWithMessage('in').nullable().optional(),
    notIn: numberArrayWithMessage('notIn').nullable().optional(),
    lt: numberWithMessage('lt').optional(),
    lte: numberWithMessage('lte').optional(),
    gt: numberWithMessage('gt').optional(),
    gte: numberWithMessage('gte').optional(),
    not: numberWithMessage('not').nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one filter condition must be provided',
  });

// Type inference
export type IntFilter = z.infer<typeof IntFilterSchema>;
export type IntNullableFilter = z.infer<typeof IntNullableFilterSchema>;
