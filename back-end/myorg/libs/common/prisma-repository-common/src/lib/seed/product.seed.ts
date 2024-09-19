import { PrismaClient } from '@prisma/client';
import { seedInventoryItem } from './inventory.seed';

export async function seedProduct(prisma: PrismaClient) {
  if ((await prisma.inventoryItem.count()) === 0) {
    await seedInventoryItem(prisma);
  }

  const user = await prisma.user.findFirstOrThrow({
    orderBy: { id: 'asc' },
  });

  const inventoryItems = await prisma.inventoryItem.findMany({
    orderBy: { id: 'asc' },
  });

  const getInventoryItemId = (name: string) => {
    const item = inventoryItems.find((item) => item.name === name);
    if (!item) throw new Error(`InventoryItem not found: ${name}`);
    return item.id;
  };

  const products = [
    {
      name: '위스키 세트',
      price: 150000,
      items: [{ name: '위스키', quantity: 1 }],
    },
    {
      name: '와인 세트',
      price: 120000,
      items: [{ name: '와인', quantity: 1 }],
    },
    {
      name: '맥주 6팩',
      price: 15000,
      items: [{ name: '맥주', quantity: 6 }],
    },
    {
      name: '소주 세트',
      price: 25000,
      items: [{ name: '소주', quantity: 5 }],
    },
    {
      name: '사케 세트',
      price: 80000,
      items: [{ name: '사케', quantity: 1 }],
    },
    {
      name: '생수 12병 세트',
      price: 10000,
      items: [{ name: '생수', quantity: 12 }],
    },
    {
      name: '탄산음료 6캔 세트',
      price: 8000,
      items: [{ name: '탄산음료', quantity: 6 }],
    },
    {
      name: '스포츠음료 6병 세트',
      price: 12000,
      items: [{ name: '스포츠음료', quantity: 6 }],
    },
    {
      name: '커피 6병 세트',
      price: 18000,
      items: [{ name: '커피', quantity: 6 }],
    },
    {
      name: '과일주스 3팩 세트',
      price: 15000,
      items: [{ name: '과일주스', quantity: 3 }],
    },
    {
      name: '골프공 세트',
      price: 50000,
      items: [{ name: '골프공', quantity: 12 }],
    },
    {
      name: '골프 티 세트',
      price: 10000,
      items: [{ name: '골프 티', quantity: 50 }],
    },
    {
      name: '골프 장갑',
      price: 20000,
      items: [{ name: '골프 장갑', quantity: 1 }],
    },
    {
      name: '스코어카드 10장',
      price: 5000,
      items: [{ name: '스코어카드', quantity: 10 }],
    },
    {
      name: '연필 세트',
      price: 3000,
      items: [{ name: '연필', quantity: 5 }],
    },
    {
      name: '쌀 10kg',
      price: 30000,
      items: [{ name: '쌀', quantity: 10 }],
    },
    {
      name: '돼지고기 세트',
      price: 50000,
      items: [{ name: '돼지고기', quantity: 2 }],
    },
    {
      name: '양파 3kg',
      price: 10000,
      items: [{ name: '양파', quantity: 3 }],
    },
    {
      name: '감자 3kg',
      price: 12000,
      items: [{ name: '감자', quantity: 3 }],
    },
    {
      name: '고추가루 500g',
      price: 15000,
      items: [{ name: '고추가루', quantity: 0.5 }],
    },
    {
      name: '골프 레슨 1회',
      price: 100000,
      items: [],
    },
    {
      name: '골프장 이용권',
      price: 200000,
      items: [],
    },
    {
      name: '골프 클럽 대여',
      price: 50000,
      items: [],
    },
    {
      name: '골프 카트 이용권',
      price: 30000,
      items: [],
    },
    {
      name: '골프 웨어 세트',
      price: 150000,
      items: [],
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        createdBy: user.id,
        updatedBy: user.id,
      },
    });

    for (const item of product.items) {
      await prisma.productInventoryItem.create({
        data: {
          productId: createdProduct.id,
          inventoryItemId: getInventoryItemId(item.name),
          quantity: item.quantity,
          createdBy: user.id,
          updatedBy: user.id,
        },
      });
    }
  }

  return await prisma.product.findMany({
    orderBy: { id: 'asc' },
    include: {
      productInventoryItems: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });
}
