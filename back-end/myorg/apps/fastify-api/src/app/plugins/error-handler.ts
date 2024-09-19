import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const errorHandlerPlugin: FastifyPluginAsync = fp(async (server, options) => {
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);

    if (error instanceof ZodError) {
      reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: fromZodError(error),
        details: error.errors,
      });
    } else if (error instanceof PrismaClientKnownRequestError) {
      const knownRequestError: PrismaClientKnownRequestError = error;
      const message = `code: ${knownRequestError.code}\nmeta: ${JSON.stringify(
        knownRequestError.meta
      )}\nclientVersion: ${knownRequestError.clientVersion}\nmessage: ${
        knownRequestError.message
      }\n`;

      reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: message,
        details: error,
      });
    }
  });
});

export default errorHandlerPlugin;
