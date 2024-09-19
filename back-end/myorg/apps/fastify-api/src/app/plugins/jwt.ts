import fastifyJwt from '@fastify/jwt';

import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import fp from 'fastify-plugin';
import { SECRET } from '../app';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jwtPlugin: FastifyPluginAsync = fp(async (server, options) => {
  await server.register(fastifyJwt, {
    secret: SECRET,
  });

  server.decorate(
    'authenticate',
    async function (
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction
    ) {
      try {
        await request.jwtVerify();
      } catch (error) {
        if (error instanceof Error) {
          reply.code(401).send({ message: error.message });
          done(error);
        } else {
          done(new Error(String(error)));
        }
      }
    }
  );
});

export default jwtPlugin;
