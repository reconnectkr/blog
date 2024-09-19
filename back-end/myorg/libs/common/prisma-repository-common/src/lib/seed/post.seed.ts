import { PrismaClient } from '@prisma/client';

export async function seedCategory(prisma: PrismaClient) {
  const user = await prisma.user.findFirstOrThrow({
    orderBy: { id: 'asc' },
  });

  await prisma.category.createMany({
    data: [
      {
        name: 'Technology',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Health',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lifestyle',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Science',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Environment',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Space',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Social',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Business',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Entertainment',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Travel',
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
}

export async function seedPost(prisma: PrismaClient) {
  if ((await prisma.category.count()) === 0) {
    await seedCategory(prisma);
  }
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' },
  });

  const getCategoryId = (name: string, userId: string) => {
    const categoryId = categories.find(
      (c) => c.name === name && c.authorId === userId
    )?.id;
    if (!categoryId) {
      throw new Error(`Category ${name} not found`);
    }
    return categoryId;
  };

  const user = await prisma.user.findFirstOrThrow({
    orderBy: { id: 'asc' },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
  };

  const posts = [
    {
      title: 'Understanding Quantum Computing',
      content: 'A deep dive into quantum mechanics and its applications.',
      categoryId: getCategoryId('Science', user.id),
      slug: generateSlug('Understanding Quantum Computing'),
    },
    {
      title: 'The Rise of Renewable Energy',
      content: 'Exploring the benefits of solar and wind energy.',
      categoryId: getCategoryId('Environment', user.id),
      slug: generateSlug('The Rise of Renewable Energy'),
    },
    {
      title: 'Advancements in Space Exploration',
      content: 'Recent missions to Mars and beyond.',
      categoryId: getCategoryId('Space', user.id),
      slug: generateSlug('Advancements in Space Exploration'),
    },
    {
      title: 'The Impact of Social Media',
      content: 'How social media shapes public opinion.',
      categoryId: getCategoryId('Social', user.id),
      slug: generateSlug('The Impact of Social Media'),
    },
    {
      title: 'Cybersecurity in the Modern Age',
      content: 'Protecting your data in a digital world.',
      categoryId: getCategoryId('Technology', user.id),
      slug: generateSlug('Cybersecurity in the Modern Age'),
    },
    {
      title: 'The Future of Work',
      content: 'Remote work trends and their implications.',
      categoryId: getCategoryId('Business', user.id),
      slug: generateSlug('The Future of Work'),
    },
    {
      title: 'Mental Health Awareness',
      content: 'The importance of mental health in today’s society.',
      categoryId: getCategoryId('Health', user.id),
      slug: generateSlug('Mental Health Awareness'),
    },
    {
      title: 'The Evolution of Video Games',
      content: 'From arcade to virtual reality.',
      categoryId: getCategoryId('Entertainment', user.id),
      slug: generateSlug('The Evolution of Video Games'),
    },
    {
      title: 'Traveling Post-Pandemic',
      content: 'How travel has changed after COVID-19.',
      categoryId: getCategoryId('Travel', user.id),
      slug: generateSlug('Traveling Post-Pandemic'),
    },
  ];

  const createdPosts = await prisma.post.createMany({
    data: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      content: post.content,
      authorId: user.id,
    })),
  });

  for (const post of posts) {
    const createdPost = await prisma.post.findUnique({
      where: { slug: post.slug },
    });
    if (createdPost) {
      await prisma.categoriesOnPosts.create({
        data: {
          postId: createdPost.id,
          categoryId: post.categoryId,
          createdBy: user.id,
        },
      });
    }
  }

  return await prisma.post.findMany({
    orderBy: { id: 'asc' },
  });
}
