import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  CreateCouponRequestSchema,
  CreateCouponResponse,
  DeleteCouponPathParamSchema,
  DeleteCouponResponse,
  GetCouponPathParamSchema,
  GetCouponResponse,
  ListCouponQueryStringSchema,
  ListCouponResponse,
  UpdateCouponPathParamSchema,
  UpdateCouponRequestSchema,
  UpdateCouponResponse,
} from '@reconnect/coupon-dto';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListCouponQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;

      const coupons = await prisma.coupon.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
      });

      const resBody: ListCouponResponse = {
        items: coupons,
      };
      res.send(resBody);
    }
  );

  fastify.post(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedBody = CreateCouponRequestSchema.parse(req.body);

      type CouponCreateBody = Prisma.Args<
        typeof prisma.coupon,
        'create'
      >['data'];

      const couponCreateBody: CouponCreateBody = {
        ...validatedBody,
        issuedBy: req.user.userId,
      };

      const coupon = await prisma.coupon.create({
        data: couponCreateBody,
      });

      const resBody: CreateCouponResponse = coupon;
      res.status(201).send(resBody);
    }
  );

  fastify.get<{ Params: { couponId: string } }>(
    '/:couponId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { couponId: string } }>,
      res: FastifyReply
    ) => {
      const couponId = GetCouponPathParamSchema.parse(req.params.couponId);
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });

      if (!coupon) {
        res.status(404).send({ message: 'Coupon not found' });
        return;
      }

      const resBody: GetCouponResponse = coupon;
      res.send(resBody);
    }
  );

  fastify.patch<{ Params: { couponId: string } }>(
    '/:couponId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { couponId: string } }>,
      res: FastifyReply
    ) => {
      const couponId = UpdateCouponPathParamSchema.parse(req.params.couponId);
      const updateData = UpdateCouponRequestSchema.parse(req.body);

      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });

      if (!coupon) {
        res.status(404).send({ message: 'Coupon not found' });
        return;
      }

      const updatedCoupon = await prisma.coupon.update({
        where: { id: coupon.id },
        data: updateData,
      });

      const resBody: UpdateCouponResponse = updatedCoupon;
      res.send(resBody);
    }
  );

  fastify.delete<{ Params: { couponId: string } }>(
    '/:couponId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { couponId: string } }>,
      res: FastifyReply
    ) => {
      const couponId = DeleteCouponPathParamSchema.parse(req.params.couponId);

      try {
        await prisma.coupon.delete({
          where: { id: couponId },
        });
        const resBody: DeleteCouponResponse = undefined;
        res.status(204).send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // {
          //   name: 'PrismaClientKnownRequestError',
          //   code: 'P2025',
          //   clientVersion: '5.19.1',
          //   meta: {
          //     modelName: 'Coupon',
          //     cause: 'Record to delete does not exist.',
          //   },
          // };
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'Coupon not found' });
            return;
          }
        }
      }
    }
  );
}
