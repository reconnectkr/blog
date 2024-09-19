import { PrismaClient } from '@prisma/client';
import { seedUnit } from './unit.seed';

export async function seedInventoryEventType(prisma: PrismaClient) {
  await prisma.inventoryEventType.createMany({
    data: [
      { id: 1, name: 'INITIAL_STOCK' },
      { id: 2, name: 'STOCK_RECEIPT' },
      { id: 3, name: 'TRANSFER_IN' },
      { id: 4, name: 'PRODUCTION' },
      { id: 5, name: 'CUSTOMER_RETURN' },
      { id: 6, name: 'ADJUSTMENT' },
      { id: 7, name: 'SALE' },
      { id: 8, name: 'CONSUMPTION' },
      { id: 9, name: 'TRANSFER_OUT' },
      { id: 10, name: 'SUPPLIER_RETURN' },
      { id: 11, name: 'EXPIRED' },
      { id: 12, name: 'THEFT_OR_LOSS' },
      { id: 13, name: 'DISPOSAL' },
    ],
  });

  return await prisma.inventoryEventType.findMany({ orderBy: { id: 'asc' } });
}

export async function seedInventoryItemCategoryType(prisma: PrismaClient) {
  await prisma.inventoryItemCategoryType.createMany({
    data: [
      { id: 1, name: '품목대분류' },
      { id: 2, name: '품목중분류' },
      { id: 3, name: '품목소분류' },
    ],
  });
}

export async function seedInventoryItemCategory(prisma: PrismaClient) {
  if ((await prisma.inventoryItemCategoryType.count()) === 0) {
    await seedInventoryItemCategoryType(prisma);
  }

  await prisma.inventoryItemCategory.createMany({
    data: [
      { id: 1, name: '식음팀', typeId: 1, code: '1' },
      { id: 2, name: '경영지원팀', typeId: 1, code: '2' },
      { id: 3, name: '코스', typeId: 1, code: '3' },
      { id: 4, name: '시설', typeId: 1, code: '4' },
      { id: 5, name: '카트', typeId: 1, code: '5' },
      { id: 6, name: '락카/미화', typeId: 1, code: '6' },
      { id: 7, name: '용역', typeId: 1, code: '9' },
      { id: 8, name: '주류/음료', typeId: 2, code: '100', parentId: 1 },
      { id: 9, name: '식사류/안주류', typeId: 2, code: '110', parentId: 1 },
      { id: 10, name: '소모품', typeId: 2, code: '120', parentId: 1 },
      { id: 11, name: '비품', typeId: 2, code: '130', parentId: 1 },
      { id: 12, name: '행사요리', typeId: 2, code: '150', parentId: 1 },
      { id: 13, name: '식재료', typeId: 2, code: '160', parentId: 1 },
      { id: 14, name: '복리후생', typeId: 2, code: '170', parentId: 1 },
      { id: 15, name: '소모품', typeId: 2, code: '200', parentId: 2 },
      { id: 16, name: '복리후생', typeId: 2, code: '210', parentId: 2 },
      { id: 17, name: '코스장비', typeId: 2, code: '300', parentId: 3 },
      { id: 18, name: '복리후생', typeId: 2, code: '310', parentId: 3 },
      { id: 19, name: '전자장비', typeId: 2, code: '400', parentId: 4 },
      { id: 20, name: '전기자재', typeId: 2, code: '410', parentId: 4 },
      { id: 21, name: '수도자재', typeId: 2, code: '420', parentId: 4 },
      { id: 22, name: '공용부품', typeId: 2, code: '430', parentId: 4 },
      { id: 23, name: '공구', typeId: 2, code: '440', parentId: 4 },
      { id: 24, name: '기타자재', typeId: 2, code: '450', parentId: 4 },
      { id: 25, name: '사무용품', typeId: 2, code: '460', parentId: 4 },
      { id: 26, name: '기타소모품', typeId: 2, code: '470', parentId: 4 },
      { id: 27, name: '복리후생', typeId: 2, code: '480', parentId: 4 },
      { id: 28, name: '개별부품', typeId: 2, code: '500', parentId: 5 },
      { id: 29, name: '공용부품', typeId: 2, code: '510', parentId: 5 },
      { id: 30, name: '잡자재', typeId: 2, code: '520', parentId: 5 },
      { id: 31, name: '공구', typeId: 2, code: '530', parentId: 5 },
      { id: 32, name: '사무용품', typeId: 2, code: '540', parentId: 5 },
      { id: 33, name: '기타소모품', typeId: 2, code: '550', parentId: 5 },
      { id: 34, name: '소모품', typeId: 2, code: '600', parentId: 6 },
      { id: 35, name: '용역계약', typeId: 2, code: '990', parentId: 7 },
      { id: 36, name: '주류', typeId: 3, code: '100-10', parentId: 8 },
      { id: 37, name: '음료', typeId: 3, code: '100-20', parentId: 8 },
      { id: 38, name: '판매메뉴', typeId: 3, code: '110-20', parentId: 9 },
      { id: 39, name: '세트메뉴', typeId: 3, code: '110-30', parentId: 9 },
      { id: 40, name: '요리류', typeId: 3, code: '110-40', parentId: 9 },
      { id: 41, name: '식사류', typeId: 3, code: '110-50', parentId: 9 },
      { id: 42, name: '안주류', typeId: 3, code: '110-60', parentId: 9 },
      { id: 43, name: '간식류', typeId: 3, code: '110-70', parentId: 9 },
      { id: 44, name: '소모품', typeId: 3, code: '120-10', parentId: 10 },
      { id: 45, name: '홀비품', typeId: 3, code: '120-20', parentId: 10 },
      { id: 46, name: '주방 비품', typeId: 3, code: '120-40', parentId: 10 },
      { id: 47, name: '비품', typeId: 3, code: '130-10', parentId: 11 },
      { id: 48, name: '행사요리', typeId: 3, code: '150-10', parentId: 12 },
      { id: 49, name: '식재료', typeId: 3, code: '160-10', parentId: 13 },
      { id: 50, name: '가공식품', typeId: 3, code: '160-20', parentId: 13 },
      { id: 51, name: '건어물', typeId: 3, code: '160-30', parentId: 13 },
      { id: 52, name: '곡류', typeId: 3, code: '160-40', parentId: 13 },
      { id: 53, name: '과일류', typeId: 3, code: '160-50', parentId: 13 },
      { id: 54, name: '야채류', typeId: 3, code: '160-60', parentId: 13 },
      { id: 55, name: '양념류', typeId: 3, code: '160-70', parentId: 13 },
      { id: 56, name: '어패수산', typeId: 3, code: '160-80', parentId: 13 },
      { id: 57, name: '축산물', typeId: 3, code: '160-90', parentId: 13 },
      { id: 58, name: '복리후생', typeId: 3, code: '170-10', parentId: 14 },
      { id: 59, name: '소모품', typeId: 3, code: '200-10', parentId: 15 },
      { id: 60, name: '복리후생', typeId: 3, code: '210-10', parentId: 16 },
      { id: 61, name: '코스장비', typeId: 3, code: '300-10', parentId: 17 },
      { id: 62, name: '복리후생', typeId: 3, code: '310-10', parentId: 18 },
      { id: 63, name: '전자장비', typeId: 3, code: '400-10', parentId: 19 },
      { id: 64, name: '전기자재', typeId: 3, code: '410-10', parentId: 20 },
      { id: 65, name: '수도자재', typeId: 3, code: '420-10', parentId: 21 },
      { id: 66, name: '공용부품', typeId: 3, code: '430-10', parentId: 22 },
      { id: 67, name: '공구', typeId: 3, code: '440-10', parentId: 23 },
      { id: 68, name: '기타자재', typeId: 3, code: '450-10', parentId: 24 },
      { id: 69, name: '사무용품', typeId: 3, code: '460-10', parentId: 25 },
      { id: 70, name: '기타소모품', typeId: 3, code: '470-10', parentId: 26 },
      { id: 71, name: '복리후생', typeId: 3, code: '480-10', parentId: 27 },
      { id: 72, name: '개별부품', typeId: 3, code: '500-10', parentId: 28 },
      { id: 73, name: '공용부품', typeId: 3, code: '510-10', parentId: 29 },
      { id: 74, name: '잡자재', typeId: 3, code: '520-10', parentId: 30 },
      { id: 75, name: '공구', typeId: 3, code: '530-10', parentId: 31 },
      { id: 76, name: '사무용품', typeId: 3, code: '540-10', parentId: 32 },
      { id: 77, name: '기타소모품', typeId: 3, code: '550-10', parentId: 33 },
      { id: 78, name: '소모품', typeId: 3, code: '600-10', parentId: 34 },
      { id: 79, name: '용역계약', typeId: 3, code: '990-10', parentId: 35 },
    ],
  });
}

export async function seedInventoryItem(prisma: PrismaClient) {
  if ((await prisma.unit.count()) === 0) {
    await seedUnit(prisma);
  }
  const units = await prisma.unit.findMany({
    orderBy: { id: 'asc' },
  });

  if ((await prisma.inventoryItemCategory.count()) === 0) {
    await seedInventoryItemCategory(prisma);
  }
  const categories = await prisma.inventoryItemCategory.findMany({
    where: {
      typeId: 3,
    },
    orderBy: { id: 'asc' },
  });

  const getUnitId = (name: string) => {
    const unitId = units.find((u) => u.name === name)?.id;
    if (!unitId) {
      throw new Error(`Unit ${name} not found`);
    }
    return unitId;
  };

  const getCategoryId = (name: string) => {
    const categoryId = categories.find((c) => c.name === name)?.id;
    if (!categoryId) {
      throw new Error(`Category ${name} not found`);
    }
    return categoryId;
  };

  const inventoryItems = [
    // 주류 (categoryId: 36)
    {
      name: '위스키',
      specification: '발렌타인 12년 700ml',
      manufacturer: '발렌타인',
      inventoryUnitId: getUnitId('병'),
      categoryId: getCategoryId('주류'),
      code: 'ALC-001',
    },
    {
      name: '와인',
      specification: '샤또 마고 2018 750ml',
      manufacturer: '샤또 마고',
      inventoryUnitId: getUnitId('병'),
      categoryId: getCategoryId('주류'),
      code: 'ALC-002',
    },
    {
      name: '맥주',
      specification: '카스 생드래프트 500ml',
      manufacturer: 'OB맥주',
      inventoryUnitId: getUnitId('캔'),
      categoryId: getCategoryId('주류'),
      code: 'ALC-003',
    },
    {
      name: '소주',
      specification: '참이슬 후레쉬 360ml',
      manufacturer: '하이트진로',
      inventoryUnitId: getUnitId('병'),
      categoryId: getCategoryId('주류'),
      code: 'ALC-004',
    },
    {
      name: '사케',
      specification: '쥰마이 다이긴조 720ml',
      manufacturer: '니혼사케',
      inventoryUnitId: getUnitId('병'),
      categoryId: getCategoryId('주류'),
      code: 'ALC-005',
    },

    // 음료 (categoryId: 37)
    {
      name: '생수',
      specification: '삼다수 2L',
      manufacturer: '제주특별자치도개발공사',
      inventoryUnitId: getUnitId('병'),
      categoryId: getCategoryId('음료'),
      code: 'BEV-001',
    },
    {
      name: '탄산음료',
      specification: '코카콜라 355ml',
      manufacturer: '코카콜라',
      inventoryUnitId: getUnitId('캔'),
      categoryId: getCategoryId('음료'),
      code: 'BEV-002',
    },
    {
      name: '스포츠음료',
      specification: '게토레이 600ml',
      manufacturer: '롯데칠성',
      inventoryUnitId: getUnitId('병'),
      categoryId: getCategoryId('음료'),
      code: 'BEV-003',
    },
    {
      name: '커피',
      specification: '아메리카노 275ml',
      manufacturer: '스타벅스',
      inventoryUnitId: getUnitId('병'),
      categoryId: getCategoryId('음료'),
      code: 'BEV-004',
    },
    {
      name: '과일주스',
      specification: '오렌지 주스 1L',
      manufacturer: '델몬트',
      inventoryUnitId: getUnitId('팩'),
      categoryId: getCategoryId('음료'),
      code: 'BEV-005',
    },

    // 식사류 (categoryId: 41)
    {
      name: '비빔밥',
      specification: '1인분',
      manufacturer: '자체제작',
      inventoryUnitId: getUnitId('개'),
      categoryId: getCategoryId('식사류'),
      code: 'MEAL-001',
    },
    {
      name: '불고기',
      specification: '200g',
      manufacturer: '자체제작',
      inventoryUnitId: getUnitId('접시'),
      categoryId: getCategoryId('식사류'),
      code: 'MEAL-002',
    },
    {
      name: '파스타',
      specification: '1인분',
      manufacturer: '자체제작',
      inventoryUnitId: getUnitId('접시'),
      categoryId: getCategoryId('식사류'),
      code: 'MEAL-003',
    },
    {
      name: '샐러드',
      specification: '1인분',
      manufacturer: '자체제작',
      inventoryUnitId: getUnitId('접시'),
      categoryId: getCategoryId('식사류'),
      code: 'MEAL-004',
    },
    {
      name: '스테이크',
      specification: '200g',
      manufacturer: '자체제작',
      inventoryUnitId: getUnitId('접시'),
      categoryId: getCategoryId('식사류'),
      code: 'MEAL-005',
    },

    // 소모품 (categoryId: 44)
    {
      name: '골프공',
      specification: 'Pro V1',
      manufacturer: 'Titleist',
      inventoryUnitId: getUnitId('개'),
      categoryId: getCategoryId('소모품'),
      code: 'CONS-001',
    },
    {
      name: '골프 티',
      specification: '나무 티 70mm',
      manufacturer: 'Generic',
      inventoryUnitId: getUnitId('박스'),
      categoryId: getCategoryId('소모품'),
      code: 'CONS-002',
    },
    {
      name: '골프 장갑',
      specification: '남성용 M 사이즈',
      manufacturer: 'FootJoy',
      inventoryUnitId: getUnitId('개'),
      categoryId: getCategoryId('소모품'),
      code: 'CONS-003',
    },
    {
      name: '스코어카드',
      specification: 'A5 사이즈',
      manufacturer: '자체제작',
      inventoryUnitId: getUnitId('장'),
      categoryId: getCategoryId('소모품'),
      code: 'CONS-004',
    },
    {
      name: '연필',
      specification: 'HB',
      manufacturer: '모나미',
      inventoryUnitId: getUnitId('개'),
      categoryId: getCategoryId('소모품'),
      code: 'CONS-005',
    },

    // 식재료 (categoryId: 49)
    {
      name: '쌀',
      specification: '20kg 백미',
      manufacturer: '농협',
      inventoryUnitId: getUnitId('포대'),
      categoryId: getCategoryId('식재료'),
      code: 'INGR-001',
    },
    {
      name: '돼지고기',
      specification: '삼겹살 1kg',
      manufacturer: '도드람',
      inventoryUnitId: getUnitId('kg'),
      categoryId: getCategoryId('식재료'),
      code: 'INGR-002',
    },
    {
      name: '양파',
      specification: '1kg 망',
      manufacturer: '국내산',
      inventoryUnitId: getUnitId('망'),
      categoryId: getCategoryId('식재료'),
      code: 'INGR-003',
    },
    {
      name: '감자',
      specification: '1kg 망',
      manufacturer: '국내산',
      inventoryUnitId: getUnitId('망'),
      categoryId: getCategoryId('식재료'),
      code: 'INGR-004',
    },
    {
      name: '고추가루',
      specification: '500g 팩',
      manufacturer: '청양농협',
      inventoryUnitId: getUnitId('팩'),
      categoryId: getCategoryId('식재료'),
      code: 'INGR-005',
    },
  ];

  const user = await prisma.user.findFirstOrThrow({
    orderBy: { id: 'asc' },
  });

  await prisma.inventoryItem.createMany({
    data: inventoryItems.map((item) => ({
      ...item,
      active: true,
      createdBy: user.id,
      updatedBy: user.id,
    })),
  });

  return await prisma.inventoryItem.findMany({
    orderBy: { id: 'asc' },
  });
}
