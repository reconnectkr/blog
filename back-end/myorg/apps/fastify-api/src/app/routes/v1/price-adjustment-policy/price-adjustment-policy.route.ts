import { PrismaClient } from '@prisma/client';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  GetPriceAdjustmentPolicyPathParamSchema,
  GetPriceAdjustmentPolicyResponse,
} from './get-price-adjustment-policy.dto';
import {
  ListPriceAdjustmentPolicyQueryStringSchema,
  ListPriceAdjustmentPolicyResponse,
} from './list-price-adjustment-policy.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString =
        ListPriceAdjustmentPolicyQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;

      const priceAdjustmentPolicys =
        await prisma.priceAdjustmentPolicy.findMany({
          where: filter,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy,
        });

      const resBody: ListPriceAdjustmentPolicyResponse = {
        items: priceAdjustmentPolicys,
      };
      res.send(resBody);
    }
  );

  fastify.get<{ Params: { priceAdjustmentPolicyId: string } }>(
    '/:priceAdjustmentPolicyId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { priceAdjustmentPolicyId: string } }>,
      res: FastifyReply
    ) => {
      const priceAdjustmentPolicyId =
        GetPriceAdjustmentPolicyPathParamSchema.parse(
          req.params.priceAdjustmentPolicyId
        );
      const priceAdjustmentPolicy =
        await prisma.priceAdjustmentPolicy.findUnique({
          where: { id: priceAdjustmentPolicyId },
        });

      if (!priceAdjustmentPolicy) {
        res.status(404).send({ message: 'PriceAdjustmentPolicy not found' });
        return;
      }

      const resBody: GetPriceAdjustmentPolicyResponse = priceAdjustmentPolicy;
      res.send(resBody);
    }
  );
  // fastify.post(
  //   '/',
  //   { onRequest: [fastify.authenticate] },
  //   async (req: FastifyRequest, res: FastifyReply) => {
  //     const validatedBody = CreatePriceAdjustmentPolicyRequestSchema.parse(req.body);

  //     type PriceAdjustmentPolicyCreateBody = Prisma.Args<
  //       typeof prisma.priceAdjustmentPolicy,
  //       'create'
  //     >['data'];

  //     const priceAdjustmentPolicyCreateBody: PriceAdjustmentPolicyCreateBody = {
  //       ...validatedBody,
  //       issuedBy: validatedBody.issuedBy ?? req.user.userId,
  //     };

  //     const priceAdjustmentPolicy = await prisma.priceAdjustmentPolicy.create({
  //       data: priceAdjustmentPolicyCreateBody,
  //     });

  //     const resBody: CreatePriceAdjustmentPolicyResponse = priceAdjustmentPolicy;
  //     res.send(resBody);
  //   }
  // );

  // fastify.patch<{ Params: { priceAdjustmentPolicyId: string } }>(
  //   '/:priceAdjustmentPolicyId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { priceAdjustmentPolicyId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const priceAdjustmentPolicyId = UpdatePriceAdjustmentPolicyPathParamSchema.parse(req.params.priceAdjustmentPolicyId);
  //     const updateData = UpdatePriceAdjustmentPolicyRequestSchema.parse(req.body);

  //     const priceAdjustmentPolicy = await prisma.priceAdjustmentPolicy.findUnique({
  //       where: { id: priceAdjustmentPolicyId },
  //     });

  //     if (!priceAdjustmentPolicy) {
  //       res.status(404).send({ message: 'PriceAdjustmentPolicy not found' });
  //       return;
  //     }

  //     const updatedPriceAdjustmentPolicy = await prisma.priceAdjustmentPolicy.update({
  //       where: { id: priceAdjustmentPolicy.id },
  //       data: updateData,
  //     });

  //     const resBody: UpdatePriceAdjustmentPolicyResponse = updatedPriceAdjustmentPolicy;
  //     res.send(resBody);
  //   }
  // );

  // fastify.delete<{ Params: { priceAdjustmentPolicyId: string } }>(
  //   '/:priceAdjustmentPolicyId',
  //   { onRequest: [fastify.authenticate] },
  //   async (
  //     req: FastifyRequest<{ Params: { priceAdjustmentPolicyId: string } }>,
  //     res: FastifyReply
  //   ) => {
  //     const priceAdjustmentPolicyId = DeletePriceAdjustmentPolicyPathParamSchema.parse(req.params.priceAdjustmentPolicyId);

  //     try {
  //       await prisma.priceAdjustmentPolicy.delete({
  //         where: { id: priceAdjustmentPolicyId },
  //       });
  //       const resBody: DeletePriceAdjustmentPolicyResponse = undefined;
  //       res.status(204).send(resBody);
  //     } catch (error) {
  //       if (error instanceof PrismaClientKnownRequestError) {
  //         // {
  //         //   name: 'PrismaClientKnownRequestError',
  //         //   code: 'P2025',
  //         //   clientVersion: '5.19.1',
  //         //   meta: {
  //         //     modelName: 'PriceAdjustmentPolicy',
  //         //     cause: 'Record to delete does not exist.',
  //         //   },
  //         // };
  //         const knownRequestError: PrismaClientKnownRequestError = error;
  //         if (knownRequestError.code === 'P2025') {
  //           res.status(404).send({ message: 'PriceAdjustmentPolicy not found' });
  //           return;
  //         }
  //       }
  //     }
  //   }
  // );
}
