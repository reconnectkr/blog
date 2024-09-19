import { z } from 'zod';

export const LoginRequestSchema = z.union([
  z
    .object({
      email: z.string().email().max(128),
      password: z.string(),
    })
    .strict(),
  z
    .object({
      username: z.string().max(32),
      password: z.string(),
    })
    .strict(),
]);
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .strict();
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
