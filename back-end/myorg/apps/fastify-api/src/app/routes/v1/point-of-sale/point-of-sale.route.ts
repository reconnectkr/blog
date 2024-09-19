import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetPointOfSalePathParamSchema,
  GetPointOfSaleResponse,
} from './get-point-of-sale.dto';
import {
  ListPointOfSaleQueryStringSchema,
  ListPointOfSaleResponse,
} from './list-point-of-sale.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListPointOfSaleQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const pointOfSales = await prisma.pointOfSale.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        include: {
          department: true,
        },
      });

      const resBody: ListPointOfSaleResponse = {
        items: pointOfSales,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { pointOfSaleId: string } }>(
    '/:pointOfSaleId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { pointOfSaleId: string } }>,
      res: FastifyReply
    ) => {
      const pointOfSaleId = GetPointOfSalePathParamSchema.parse(
        req.params.pointOfSaleId
      );
      const pointOfSale = await prisma.pointOfSale.findUnique({
        where: { id: pointOfSaleId },
        include: {
          department: true,
        },
      });

      if (!pointOfSale) {
        res.status(404).send({ message: 'PointOfSale not found' });
        return;
      }

      const resBody: GetPointOfSaleResponse = pointOfSale;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreatePointOfSaleRequestSchema.parse(req.body);

  //     type PointOfSaleCreateBody = Prisma.Args<
  //       typeof prisma.pointOfSale,
  //       'create'
  //     >['data'];

  //     const pointOfSaleCreateBody: PointOfSaleCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const pointOfSale = await prisma.pointOfSale.create({
  //       data: pointOfSaleCreateBody,
  //     });

  //     const resBody: CreatePointOfSaleResponse = pointOfSale;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { pointOfSaleId: string } }>(
  //   '/:pointOfSaleId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { pointOfSaleId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const pointOfSaleId = UpdatePointOfSalePathParamSchema.parse(req.params.pointOfSaleId);
  //     const updateData = UpdatePointOfSaleRequestSchema.parse(req.body);

  //     const pointOfSale = await prisma.pointOfSale.findUnique({
  //       where: { id: pointOfSaleId },
  //     });

  //     if (!pointOfSale) {
  //       res.status(404).send({ message: 'PointOfSale not found' });
  //       return;
  //     }

  //     const updatedPointOfSale = await prisma.pointOfSale.update({
  //       where: { id: pointOfSale.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdatePointOfSaleResponse = updatedPointOfSale;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { pointOfSaleId: string } }>(
  //   '/:pointOfSaleId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { pointOfSaleId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const pointOfSaleId = DeletePointOfSalePathParamSchema.parse(req.params.pointOfSaleId);

  //     try {
  //       await prisma.pointOfSale.delete({
  //         where: { id: pointOfSaleId },
  //       });
  //       const resBody: DeletePointOfSaleResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'PointOfSale',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'PointOfSale not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
