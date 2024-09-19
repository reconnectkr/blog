import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetPaymentTypePathParamSchema,
  GetPaymentTypeResponse,
} from './get-payment-type.dto';
import {
  ListPaymentTypeQueryStringSchema,
  ListPaymentTypeResponse,
} from './list-payment-type.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListPaymentTypeQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const paymentTypes = await prisma.paymentType.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
      });

      const resBody: ListPaymentTypeResponse = {
        items: paymentTypes,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { paymentTypeId: string } }>(
    '/:paymentTypeId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { paymentTypeId: string } }>,
      res: FastifyReply
    ) => {
      const paymentTypeId = GetPaymentTypePathParamSchema.parse(
        req.params.paymentTypeId
      );
      const paymentType = await prisma.paymentType.findUnique({
        where: { id: paymentTypeId },
      });

      if (!paymentType) {
        res.status(404).send({ message: 'PaymentType not found' });
        return;
      }

      const resBody: GetPaymentTypeResponse = paymentType;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreatePaymentTypeRequestSchema.parse(req.body);

  //     type PaymentTypeCreateBody = Prisma.Args<
  //       typeof prisma.paymentType,
  //       'create'
  //     >['data'];

  //     const paymentTypeCreateBody: PaymentTypeCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const paymentType = await prisma.paymentType.create({
  //       data: paymentTypeCreateBody,
  //     });

  //     const resBody: CreatePaymentTypeResponse = paymentType;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { paymentTypeId: string } }>(
  //   '/:paymentTypeId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { paymentTypeId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const paymentTypeId = UpdatePaymentTypePathParamSchema.parse(req.params.paymentTypeId);
  //     const updateData = UpdatePaymentTypeRequestSchema.parse(req.body);

  //     const paymentType = await prisma.paymentType.findUnique({
  //       where: { id: paymentTypeId },
  //     });

  //     if (!paymentType) {
  //       res.status(404).send({ message: 'PaymentType not found' });
  //       return;
  //     }

  //     const updatedPaymentType = await prisma.paymentType.update({
  //       where: { id: paymentType.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdatePaymentTypeResponse = updatedPaymentType;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { paymentTypeId: string } }>(
  //   '/:paymentTypeId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { paymentTypeId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const paymentTypeId = DeletePaymentTypePathParamSchema.parse(req.params.paymentTypeId);

  //     try {
  //       await prisma.paymentType.delete({
  //         where: { id: paymentTypeId },
  //       });
  //       const resBody: DeletePaymentTypeResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'PaymentType',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'PaymentType not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
