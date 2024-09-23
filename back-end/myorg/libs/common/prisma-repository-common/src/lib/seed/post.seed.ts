import { Post, PrismaClient } from '@prisma/client';

export async function seedPost(prisma: PrismaClient) {
  const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });

  const posts: Post[] = [];
  for (const category of categories) {
    for (let i = 0; i < 3; i++) {
      posts.push(
        await prisma.post.create({
          data: {
            title: `Post ${i} ${category.name}`,
            content: `Content ${i} ${category.name}`,
            categories: {
              create: {
                categoryId: category.id,
              },
            },
          },
        })
      );
    }
  }

  return posts;
}
