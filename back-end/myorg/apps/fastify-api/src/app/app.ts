import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';
import * as path from 'path';

/* eslint-disable-next-line */
export interface AppOptions {}

export const SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const ACCESS_TOKEN_LIFE_TIME = '15m';
export const REFRESH_TOKEN_LIFE_TIME = '7d';

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    ignorePattern: /(^.*(?:test|spec).(t|j)s$)|(test-fixture[s].ts)/,
    options: { ...opts, prefix: '/api' },
  });

  const CORS_ORIGIN_REGEX =
    process.env.FASTIFY_CORS_ORIGIN_REGEX || 'http://localhost:4200';
  await fastify.register(cors, {
    origin: new RegExp(CORS_ORIGIN_REGEX),
  });
}
