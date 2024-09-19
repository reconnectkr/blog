import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetPaymentMethodPathParamSchema,
  GetPaymentMethodResponse,
} from './get-payment-method.dto';
import {
  ListPaymentMethodQueryStringSchema,
  ListPaymentMethodResponse,
} from './list-payment-method.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListPaymentMethodQueryStringSchema.parse(
        req.query
      );
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const paymentMethods = await prisma.paymentMethod.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
      });

      const resBody: ListPaymentMethodResponse = {
        items: paymentMethods,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { paymentMethodId: string } }>(
    '/:paymentMethodId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { paymentMethodId: string } }>,
      res: FastifyReply
    ) => {
      const paymentMethodId = GetPaymentMethodPathParamSchema.parse(
        req.params.paymentMethodId
      );
      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId },
      });

      if (!paymentMethod) {
        res.status(404).send({ message: 'PaymentMethod not found' });
        return;
      }

      const resBody: GetPaymentMethodResponse = paymentMethod;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreatePaymentMethodRequestSchema.parse(req.body);

  //     type PaymentMethodCreateBody = Prisma.Args<
  //       typeof prisma.paymentMethod,
  //       'create'
  //     >['data'];

  //     const paymentMethodCreateBody: PaymentMethodCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const paymentMethod = await prisma.paymentMethod.create({
  //       data: paymentMethodCreateBody,
  //     });

  //     const resBody: CreatePaymentMethodResponse = paymentMethod;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { paymentMethodId: string } }>(
  //   '/:paymentMethodId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { paymentMethodId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const paymentMethodId = UpdatePaymentMethodPathParamSchema.parse(req.params.paymentMethodId);
  //     const updateData = UpdatePaymentMethodRequestSchema.parse(req.body);

  //     const paymentMethod = await prisma.paymentMethod.findUnique({
  //       where: { id: paymentMethodId },
  //     });

  //     if (!paymentMethod) {
  //       res.status(404).send({ message: 'PaymentMethod not found' });
  //       return;
  //     }

  //     const updatedPaymentMethod = await prisma.paymentMethod.update({
  //       where: { id: paymentMethod.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdatePaymentMethodResponse = updatedPaymentMethod;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { paymentMethodId: string } }>(
  //   '/:paymentMethodId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { paymentMethodId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const paymentMethodId = DeletePaymentMethodPathParamSchema.parse(req.params.paymentMethodId);

  //     try {
  //       await prisma.paymentMethod.delete({
  //         where: { id: paymentMethodId },
  //       });
  //       const resBody: DeletePaymentMethodResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'PaymentMethod',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'PaymentMethod not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
