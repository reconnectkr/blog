import { PrismaClient } from '@prisma/client';

export async function seedUnitType(prisma: PrismaClient) {
  await prisma.unitType.createMany({
    data: [
      { name: 'WEIGHT', description: 'Units for measuring mass' },
      {
        name: 'VOLUME',
        description: 'Units for measuring three-dimensional space',
      },
      { name: 'LENGTH', description: 'Units for measuring distance' },
      {
        name: 'AREA',
        description: 'Units for measuring two-dimensional space',
      },
      { name: 'TEMPERATURE', description: 'Units for measuring heat' },
      { name: 'TIME', description: 'Units for measuring duration' },
      { name: 'CURRENCY', description: 'Units for measuring monetary value' },
      {
        name: 'COUNT',
        description: 'Units for measuring quantity or number of items',
      },
    ],
  });
}

export async function seedUnit(prisma: PrismaClient) {
  await seedUnitType(prisma);

  const weightUnitType = await prisma.unitType.findUniqueOrThrow({
    where: { name: 'WEIGHT' },
  });
  const volumeUnitType = await prisma.unitType.findUniqueOrThrow({
    where: { name: 'VOLUME' },
  });
  const lengthUnitType = await prisma.unitType.findUniqueOrThrow({
    where: { name: 'LENGTH' },
  });
  const currencyUnitType = await prisma.unitType.findUniqueOrThrow({
    where: { name: 'CURRENCY' },
  });
  const timeUnitType = await prisma.unitType.findUniqueOrThrow({
    where: { name: 'TIME' },
  });
  const countUnitType = await prisma.unitType.findUniqueOrThrow({
    where: { name: 'COUNT' },
  });

  await prisma.unit.createMany({
    data: [
      // 무게 단위
      { name: 'mg', description: 'Milligram', typeId: weightUnitType.id },
      { name: 'g', description: 'Gram', typeId: weightUnitType.id },
      { name: 'kg', description: 'Kilogram', typeId: weightUnitType.id },
      { name: 'ton', description: 'Ton', typeId: weightUnitType.id },

      // 부피 단위
      { name: 'ml', description: 'Milliliter', typeId: volumeUnitType.id },
      {
        name: 'cc',
        description: 'Cubic centimeter',
        typeId: volumeUnitType.id,
      },
      { name: 'l', description: 'Liter', typeId: volumeUnitType.id },
      { name: 'm³', description: 'Cubic meter', typeId: volumeUnitType.id },

      // 길이 단위
      { name: 'mm', description: 'Millimeter', typeId: lengthUnitType.id },
      { name: 'cm', description: 'Centimeter', typeId: lengthUnitType.id },
      { name: 'm', description: 'Meter', typeId: lengthUnitType.id },

      // 화폐 단위
      { name: '₩', description: 'Korean Won', typeId: currencyUnitType.id },
      { name: '$', description: 'US Dollar', typeId: currencyUnitType.id },

      // 시간 단위
      { name: 's', description: 'Second', typeId: timeUnitType.id },
      { name: 'min', description: 'Minute', typeId: timeUnitType.id },
      { name: 'hour', description: 'Hour', typeId: timeUnitType.id },

      // 개수 단위
      { name: 'ea', description: 'Each', typeId: countUnitType.id },
      { name: '개', description: 'Piece', typeId: countUnitType.id },
      { name: '병', description: 'Bottle', typeId: countUnitType.id },
      { name: '캔', description: 'Can', typeId: countUnitType.id },
      { name: '팩', description: 'Pack', typeId: countUnitType.id },
      { name: '접시', description: 'Plate', typeId: countUnitType.id },
      { name: '장', description: 'Sheet', typeId: countUnitType.id },
      { name: '포대', description: 'Sack', typeId: countUnitType.id },
      { name: '박스', description: 'Box', typeId: countUnitType.id },
      { name: '망', description: 'Net', typeId: countUnitType.id },
      { name: '봉', description: 'Bunch', typeId: countUnitType.id },
    ],
  });
  return await prisma.unit.findMany({ orderBy: { id: 'asc' } });
}
