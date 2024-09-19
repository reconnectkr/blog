import { z } from 'zod';

export const SignUpRequestSchema = z
  .object({
    email: z.string().email().max(128),
    username: z.string().max(32),
    name: z.string().max(64),
    password: z.string(),
  })
  .strict();

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

export const SignUpResponseSchema = z
  .object({
    email: z.string(),
    username: z.string(),
    name: z.string(),
  })
  .strict();
export type SignUpResponse = z.infer<typeof SignUpResponseSchema>;
