import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetPriceAdjustablePathParamSchema,
  GetPriceAdjustableResponse,
} from './get-price-adjustable.dto';
import {
  ListPriceAdjustableQueryStringSchema,
  ListPriceAdjustableResponse,
} from './list-price-adjustable.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListPriceAdjustableQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const priceAdjustables = await prisma.priceAdjustable.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
      });

      const resBody: ListPriceAdjustableResponse = {
        items: priceAdjustables,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { priceAdjustableId: string } }>(
    '/:priceAdjustableId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { priceAdjustableId: string } }>,
      res: FastifyReply
    ) => {
      const priceAdjustableId = GetPriceAdjustablePathParamSchema.parse(
        req.params.priceAdjustableId
      );
      const priceAdjustable = await prisma.priceAdjustable.findUnique({
        where: { id: priceAdjustableId },
      });

      if (!priceAdjustable) {
        res.status(404).send({ message: 'PriceAdjustable not found' });
        return;
      }

      const resBody: GetPriceAdjustableResponse = priceAdjustable;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreatePriceAdjustableRequestSchema.parse(req.body);

  //     type PriceAdjustableCreateBody = Prisma.Args<
  //       typeof prisma.priceAdjustable,
  //       'create'
  //     >['data'];

  //     const priceAdjustableCreateBody: PriceAdjustableCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const priceAdjustable = await prisma.priceAdjustable.create({
  //       data: priceAdjustableCreateBody,
  //     });

  //     const resBody: CreatePriceAdjustableResponse = priceAdjustable;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { priceAdjustableId: string } }>(
  //   '/:priceAdjustableId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { priceAdjustableId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const priceAdjustableId = UpdatePriceAdjustablePathParamSchema.parse(req.params.priceAdjustableId);
  //     const updateData = UpdatePriceAdjustableRequestSchema.parse(req.body);

  //     const priceAdjustable = await prisma.priceAdjustable.findUnique({
  //       where: { id: priceAdjustableId },
  //     });

  //     if (!priceAdjustable) {
  //       res.status(404).send({ message: 'PriceAdjustable not found' });
  //       return;
  //     }

  //     const updatedPriceAdjustable = await prisma.priceAdjustable.update({
  //       where: { id: priceAdjustable.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdatePriceAdjustableResponse = updatedPriceAdjustable;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { priceAdjustableId: string } }>(
  //   '/:priceAdjustableId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { priceAdjustableId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const priceAdjustableId = DeletePriceAdjustablePathParamSchema.parse(req.params.priceAdjustableId);

  //     try {
  //       await prisma.priceAdjustable.delete({
  //         where: { id: priceAdjustableId },
  //       });
  //       const resBody: DeletePriceAdjustableResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'PriceAdjustable',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'PriceAdjustable not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
