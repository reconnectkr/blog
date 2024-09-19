import '@fastify/auth';
import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;

    authenticate(
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction
    ): Promise<void>;
  }
}

// JWT 페이로드 타입 정의 (필요에 따라 커스터마이즈)
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: int; username: string; role: string }; // payload type is used for signing and verifying
    user: {
      userId: int;
      username: string;
      role: string;
    }; // user type is return type of `request.user` object
  }
}
