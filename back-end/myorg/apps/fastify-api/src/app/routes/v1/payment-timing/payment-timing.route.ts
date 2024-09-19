import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetPaymentTimingPathParamSchema,
  GetPaymentTimingResponse,
} from './get-payment-timing.dto';
import {
  ListPaymentTimingQueryStringSchema,
  ListPaymentTimingResponse,
} from './list-payment-timing.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListPaymentTimingQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const paymentTimings = await prisma.paymentTiming.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
      });

      const resBody: ListPaymentTimingResponse = {
        items: paymentTimings,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { paymentTimingId: string } }>(
    '/:paymentTimingId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { paymentTimingId: string } }>,
      res: FastifyReply
    ) => {
      const paymentTimingId = GetPaymentTimingPathParamSchema.parse(
        req.params.paymentTimingId
      );
      const paymentTiming = await prisma.paymentTiming.findUnique({
        where: { id: paymentTimingId },
      });

      if (!paymentTiming) {
        res.status(404).send({ message: 'PaymentTiming not found' });
        return;
      }

      const resBody: GetPaymentTimingResponse = paymentTiming;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreatePaymentTimingRequestSchema.parse(req.body);

  //     type PaymentTimingCreateBody = Prisma.Args<
  //       typeof prisma.paymentTiming,
  //       'create'
  //     >['data'];

  //     const paymentTimingCreateBody: PaymentTimingCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const paymentTiming = await prisma.paymentTiming.create({
  //       data: paymentTimingCreateBody,
  //     });

  //     const resBody: CreatePaymentTimingResponse = paymentTiming;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { paymentTimingId: string } }>(
  //   '/:paymentTimingId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { paymentTimingId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const paymentTimingId = UpdatePaymentTimingPathParamSchema.parse(req.params.paymentTimingId);
  //     const updateData = UpdatePaymentTimingRequestSchema.parse(req.body);

  //     const paymentTiming = await prisma.paymentTiming.findUnique({
  //       where: { id: paymentTimingId },
  //     });

  //     if (!paymentTiming) {
  //       res.status(404).send({ message: 'PaymentTiming not found' });
  //       return;
  //     }

  //     const updatedPaymentTiming = await prisma.paymentTiming.update({
  //       where: { id: paymentTiming.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdatePaymentTimingResponse = updatedPaymentTiming;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { paymentTimingId: string } }>(
  //   '/:paymentTimingId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { paymentTimingId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const paymentTimingId = DeletePaymentTimingPathParamSchema.parse(req.params.paymentTimingId);

  //     try {
  //       await prisma.paymentTiming.delete({
  //         where: { id: paymentTimingId },
  //       });
  //       const resBody: DeletePaymentTimingResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'PaymentTiming',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'PaymentTiming not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
