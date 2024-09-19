import { Prisma } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { z } from 'zod';

export const DecimalSchema = z.custom<Decimal>(
  (val) => {
    if (val instanceof Decimal || val instanceof Prisma.Decimal) {
      return true;
    }

    if (typeof val === 'string' || typeof val === 'number') {
      try {
        new Decimal(val);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  },
  {
    message: 'Invalid Decimal value',
  }
);

export const coerceDecimalSchema = z.preprocess((val) => {
  if (val instanceof Decimal) {
    return val;
  } else if (val instanceof Prisma.Decimal) {
    return new Decimal(val);
  }

  if (typeof val === 'string' || typeof val === 'number') {
    try {
      return new Decimal(val);
    } catch {
      return val;
    }
  }
  return val;
}, DecimalSchema);

export const coerceBooleanSchema = z.preprocess((val) => {
  if (typeof val === 'boolean') {
    return val;
  } else if (typeof val === 'string') {
    const valLower = val.toLowerCase();
    if (valLower === 'true') {
      return true;
    } else if (valLower === 'false') {
      return false;
    }
  } else if (typeof val === 'number') {
    if (val === 0) {
      return false;
    } else if (val === 1) {
      return true;
    }
  }

  return val;
}, z.boolean());
