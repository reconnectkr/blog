import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetPriceAdjustmentTypePathParamSchema,
  GetPriceAdjustmentTypeResponse,
} from './get-price-adjustment-type.dto';
import {
  ListPriceAdjustmentTypeQueryStringSchema,
  ListPriceAdjustmentTypeResponse,
} from './list-price-adjustment-type.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString =
        ListPriceAdjustmentTypeQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const priceAdjustmentTypes = await prisma.priceAdjustmentType.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
      });

      const resBody: ListPriceAdjustmentTypeResponse = {
        items: priceAdjustmentTypes,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { priceAdjustmentTypeId: string } }>(
    '/:priceAdjustmentTypeId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { priceAdjustmentTypeId: string } }>,
      res: FastifyReply
    ) => {
      const priceAdjustmentTypeId = GetPriceAdjustmentTypePathParamSchema.parse(
        req.params.priceAdjustmentTypeId
      );
      const priceAdjustmentType = await prisma.priceAdjustmentType.findUnique({
        where: { id: priceAdjustmentTypeId },
      });

      if (!priceAdjustmentType) {
        res.status(404).send({ message: 'PriceAdjustmentType not found' });
        return;
      }

      const resBody: GetPriceAdjustmentTypeResponse = priceAdjustmentType;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreatePriceAdjustmentTypeRequestSchema.parse(req.body);

  //     type PriceAdjustmentTypeCreateBody = Prisma.Args<
  //       typeof prisma.priceAdjustmentType,
  //       'create'
  //     >['data'];

  //     const priceAdjustmentTypeCreateBody: PriceAdjustmentTypeCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const priceAdjustmentType = await prisma.priceAdjustmentType.create({
  //       data: priceAdjustmentTypeCreateBody,
  //     });

  //     const resBody: CreatePriceAdjustmentTypeResponse = priceAdjustmentType;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { priceAdjustmentTypeId: string } }>(
  //   '/:priceAdjustmentTypeId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { priceAdjustmentTypeId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const priceAdjustmentTypeId = UpdatePriceAdjustmentTypePathParamSchema.parse(req.params.priceAdjustmentTypeId);
  //     const updateData = UpdatePriceAdjustmentTypeRequestSchema.parse(req.body);

  //     const priceAdjustmentType = await prisma.priceAdjustmentType.findUnique({
  //       where: { id: priceAdjustmentTypeId },
  //     });

  //     if (!priceAdjustmentType) {
  //       res.status(404).send({ message: 'PriceAdjustmentType not found' });
  //       return;
  //     }

  //     const updatedPriceAdjustmentType = await prisma.priceAdjustmentType.update({
  //       where: { id: priceAdjustmentType.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdatePriceAdjustmentTypeResponse = updatedPriceAdjustmentType;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { priceAdjustmentTypeId: string } }>(
  //   '/:priceAdjustmentTypeId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { priceAdjustmentTypeId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const priceAdjustmentTypeId = DeletePriceAdjustmentTypePathParamSchema.parse(req.params.priceAdjustmentTypeId);

  //     try {
  //       await prisma.priceAdjustmentType.delete({
  //         where: { id: priceAdjustmentTypeId },
  //       });
  //       const resBody: DeletePriceAdjustmentTypeResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'PriceAdjustmentType',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'PriceAdjustmentType not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
