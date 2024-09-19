import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  SignUpRequest,
  SignUpRequestSchema,
  SignUpResponse,
} from './signup.dto';

export default async function (fastify: FastifyInstance) {
  const prisma: PrismaClient = fastify.prisma;

  fastify.post<{ Body: SignUpRequest; Reply: SignUpResponse }>(
    '/',
    {
      schema: {
        description: 'User signup',
        tags: ['User'],
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            username: { type: 'string' },
            name: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['email', 'username', 'name', 'password'],
        },
        response: {
          201: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              username: { type: 'string' },
              name: { type: 'string' },
            },
          },
          409: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (req: FastifyRequest<{ Body: SignUpRequest }>, res: FastifyReply) => {
      const validatedBody = SignUpRequestSchema.parse(req.body);

      // Check if email or username already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: validatedBody.email },
            { username: validatedBody.username },
          ],
        },
      });

      if (existingUser) {
        return res
          .status(409)
          .send({ message: 'Email or username already exists' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        validatedBody.password,
        saltRounds
      );

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          id: randomUUID(), // Generate a unique ID
          email: validatedBody.email,
          username: validatedBody.username,
          password: hashedPassword,
        },
      });

      const profile = await prisma.profile.create({
        data: {
          userId: newUser.id,
          name: validatedBody.name,
        },
      });

      const resBody: SignUpResponse = {
        email: newUser.email,
        username: newUser.username,
        name: profile.name,
      };

      res.status(201).send(resBody);
    }
  );
}
