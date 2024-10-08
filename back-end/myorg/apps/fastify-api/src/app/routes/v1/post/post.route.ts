import { Category, Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from '@reconnect/zod-common';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreatePostRequestSchema, CreatePostResponse } from './create-post.dto';
import {
  DeletePostPathParamSchema,
  DeletePostResponse,
} from './delete-post.dto';
import { GetPostPathParamSchema, GetPostResponse } from './get-post.dto';
import {
  ListPostQueryStringSchema,
  ListPostResponse,
  ListPostResponseSchema,
} from './list-post.dto';
import {
  UpdatePostPathParamSchema,
  UpdatePostRequestSchema,
  UpdatePostResponse,
  UpdatePostResponseSchema,
} from './update-post.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.get<{ Params: { postId: string } }>(
    '/:postId',
    // { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { postId: string } }>,
      res: FastifyReply
    ) => {
      const postId = GetPostPathParamSchema.parse(req.params.postId);
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!post) {
        res.status(404).send({ message: 'Post not found' });
        return;
      }

      const resBody: GetPostResponse = {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        categories: post.categories.map((categoryOnpost) => ({
          id: categoryOnpost.category.id,
          name: categoryOnpost.category.name,
        })),
      };
      res.send(resBody);
    }
  );

  fastify.get(
    '/',
    // { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedQueryString = ListPostQueryStringSchema.parse(req.query);
      const { filter, orderBy } = validatedQueryString;
      const page = validatedQueryString.page ?? 1;
      const pageSize: number =
        validatedQueryString.pageSize !== undefined
          ? Math.min(validatedQueryString.pageSize, PAGE_SIZE_MAX)
          : PAGE_SIZE_DEFAULT;
      const posts = await prisma.post.findMany({
        where: filter,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy,
        include: {
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      const resBody: ListPostResponse = {
        items: posts.map((post) => ({
          id: post.id,
          title: post.title,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          categories: post.categories.map((categoryOnpost) => ({
            id: categoryOnpost.category.id,
            name: categoryOnpost.category.name,
          })),
        })),
      };
      ListPostResponseSchema.parse(resBody);
      res.send(resBody);
    }
  );

  fastify.delete<{ Params: { postId: string } }>(
    '/:postId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { postId: string } }>,
      res: FastifyReply
    ) => {
      const postId = DeletePostPathParamSchema.parse(req.params.postId);

      try {
        await prisma.post.delete({
          where: { id: postId },
        });
        const resBody: DeletePostResponse = undefined;
        res.status(204).send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // {
          //   name: 'PrismaClientKnownRequestError',
          //   code: 'P2025',
          //   clientVersion: '5.19.1',
          //   meta: {
          //     modelName: 'Post',
          //     cause: 'Record to delete does not exist.',
          //   },
          // };
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'Post not found' });
            return;
          }
        }
      }
    }
  );

  fastify.post(
    '/',
    { onRequest: [fastify.authenticate] },
    async (req: FastifyRequest, res: FastifyReply) => {
      const validatedBody = CreatePostRequestSchema.parse(req.body);

      type PostCreateBody = Prisma.Args<typeof prisma.post, 'create'>['data'];

      const postCreateBody: PostCreateBody = {
        title: validatedBody.title,
        content: validatedBody.content,
        categories: {
          create: validatedBody.categories.map((category) => ({
            category: {
              connect: {
                name: category,
              },
            },
          })),
        },
        // createdBy: req.user.userId,
        // updatedBy: req.user.userId,
      };

      const post = await prisma.post.create({
        data: postCreateBody,
        include: {
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      const resBody: CreatePostResponse = {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        categories: post.categories.map((categoryOnpost) => ({
          id: categoryOnpost.category.id,
          name: categoryOnpost.category.name,
        })),
      };
      res.status(201).send(resBody);
    }
  );

  fastify.patch<{ Params: { postId: number } }>(
    '/:postId',
    { onRequest: [fastify.authenticate] },
    async (
      req: FastifyRequest<{ Params: { postId: number } }>,
      res: FastifyReply
    ) => {
      const postId = UpdatePostPathParamSchema.parse(req.params.postId);
      const validatedBody = UpdatePostRequestSchema.parse(req.body);
      try {
        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: {
            title: validatedBody.title,
            content: validatedBody.content,
          },
        });

        let categories: Category[];
        if (validatedBody.categories) {
          await prisma.categoriesOnPosts.deleteMany({
            where: { postId: postId },
          });

          categories = await prisma.category.findMany({
            where: {
              name: {
                in: validatedBody.categories,
              },
            },
          });

          await prisma.categoriesOnPosts.createMany({
            data: categories.map((category) => ({
              categoryId: category.id,
              postId: postId,
            })),
          });
        }

        const postUpdated = await prisma.post.findFirstOrThrow({
          where: {
            id: postId,
          },
          include: {
            categories: {
              select: {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        const resBody: UpdatePostResponse = {
          id: postUpdated.id,
          title: postUpdated.title,
          content: postUpdated.content,
          createdAt: postUpdated.createdAt,
          updatedAt: postUpdated.updatedAt,
          categories: postUpdated.categories.map((categoryOnpost) => ({
            id: categoryOnpost.category.id,
            name: categoryOnpost.category.name,
          })),
        };
        UpdatePostResponseSchema.parse(resBody);
        res.send(resBody);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const knownRequestError: PrismaClientKnownRequestError = error;
          if (knownRequestError.code === 'P2025') {
            res.status(404).send({ message: 'Post not found' });
            return;
          }
        }
      }
    }
  );
}
