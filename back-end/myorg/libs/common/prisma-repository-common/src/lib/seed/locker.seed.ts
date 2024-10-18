import { PrismaClient } from '@prisma/client';

export async function seedLockerAction(prisma: PrismaClient) {
  await prisma.lockerAction.createMany({
    data: [
      { id: 1, name: 'assign' },
      { id: 2, name: 'release' },
      { id: 3, name: 'disable' },
      { id: 4, name: 'enable' },
    ],
  });

  return await prisma.lockerAction.findMany({ orderBy: { id: 'asc' } });
}

export async function seedLockerRoom(prisma: PrismaClient) {
  await prisma.lockerRoom.createMany({
    data: [
      { id: 1, name: '남자사우나' },
      { id: 2, name: '여자사우나' },
      { id: 3, name: '남자락커룸' },
      { id: 4, name: '여자락커룸' },
      { id: 5, name: 'VIP락커룸' },
    ],
  });

  return await prisma.lockerRoom.findMany({ orderBy: { id: 'asc' } });
}

export async function seedLocker(prisma: PrismaClient) {
  if ((await prisma.lockerRoom.count()) === 0) {
    await seedLockerRoom(prisma);
  }

  await prisma.locker.createMany({
    data: [
      { id: 1, name: '1', lockerRoomId: 1 },
      { id: 2, name: '2', lockerRoomId: 1 },
      { id: 3, name: '3', lockerRoomId: 1 },
      { id: 4, name: '4', lockerRoomId: 1 },
      { id: 5, name: '5', lockerRoomId: 1 },
      { id: 6, name: '6', lockerRoomId: 1 },
      { id: 7, name: '7', lockerRoomId: 1 },
      { id: 8, name: '8', lockerRoomId: 1 },
      { id: 9, name: '9', lockerRoomId: 1 },
      { id: 10, name: '10', lockerRoomId: 1 },
      { id: 11, name: '11', lockerRoomId: 1 },
      { id: 12, name: '12', lockerRoomId: 1 },
      { id: 13, name: '13', lockerRoomId: 1 },
      { id: 14, name: '14', lockerRoomId: 1 },
      { id: 15, name: '15', lockerRoomId: 1 },
      { id: 16, name: '16', lockerRoomId: 1 },
      { id: 17, name: '17', lockerRoomId: 1 },
      { id: 18, name: '18', lockerRoomId: 1 },
      { id: 19, name: '19', lockerRoomId: 1 },
      { id: 20, name: '20', lockerRoomId: 1 },
      { id: 21, name: '1', lockerRoomId: 2 },
      { id: 22, name: '2', lockerRoomId: 2 },
      { id: 23, name: '3', lockerRoomId: 2 },
      { id: 24, name: '4', lockerRoomId: 2 },
      { id: 25, name: '5', lockerRoomId: 2 },
      { id: 26, name: '6', lockerRoomId: 2 },
      { id: 27, name: '7', lockerRoomId: 2 },
      { id: 28, name: '8', lockerRoomId: 2 },
      { id: 29, name: '9', lockerRoomId: 2 },
      { id: 30, name: '10', lockerRoomId: 2 },
      { id: 31, name: '11', lockerRoomId: 2 },
      { id: 32, name: '12', lockerRoomId: 2 },
      { id: 33, name: '13', lockerRoomId: 2 },
      { id: 34, name: '14', lockerRoomId: 2 },
      { id: 35, name: '15', lockerRoomId: 2 },
      { id: 36, name: '16', lockerRoomId: 2 },
      { id: 37, name: '17', lockerRoomId: 2 },
      { id: 38, name: '18', lockerRoomId: 2 },
      { id: 39, name: '19', lockerRoomId: 2 },
      { id: 40, name: '20', lockerRoomId: 2 },
      { id: 41, name: '1', lockerRoomId: 3 },
      { id: 42, name: '2', lockerRoomId: 3 },
      { id: 43, name: '3', lockerRoomId: 3 },
      { id: 44, name: '4', lockerRoomId: 3 },
      { id: 45, name: '5', lockerRoomId: 3 },
      { id: 46, name: '6', lockerRoomId: 3 },
      { id: 47, name: '7', lockerRoomId: 3 },
      { id: 48, name: '8', lockerRoomId: 3 },
      { id: 49, name: '9', lockerRoomId: 3 },
      { id: 50, name: '10', lockerRoomId: 3 },
      { id: 51, name: '11', lockerRoomId: 3 },
      { id: 52, name: '12', lockerRoomId: 3 },
      { id: 53, name: '13', lockerRoomId: 3 },
      { id: 54, name: '14', lockerRoomId: 3 },
      { id: 55, name: '15', lockerRoomId: 3 },
      { id: 56, name: '16', lockerRoomId: 3 },
      { id: 57, name: '17', lockerRoomId: 3 },
      { id: 58, name: '18', lockerRoomId: 3 },
      { id: 59, name: '19', lockerRoomId: 3 },
      { id: 60, name: '20', lockerRoomId: 3 },
      { id: 61, name: '1', lockerRoomId: 4 },
      { id: 62, name: '2', lockerRoomId: 4 },
      { id: 63, name: '3', lockerRoomId: 4 },
      { id: 64, name: '4', lockerRoomId: 4 },
      { id: 65, name: '5', lockerRoomId: 4 },
      { id: 66, name: '6', lockerRoomId: 4 },
      { id: 67, name: '7', lockerRoomId: 4 },
      { id: 68, name: '8', lockerRoomId: 4 },
      { id: 69, name: '9', lockerRoomId: 4 },
      { id: 70, name: '10', lockerRoomId: 4 },
      { id: 71, name: '11', lockerRoomId: 4 },
      { id: 72, name: '12', lockerRoomId: 4 },
      { id: 73, name: '13', lockerRoomId: 4 },
      { id: 74, name: '14', lockerRoomId: 4 },
      { id: 75, name: '15', lockerRoomId: 4 },
      { id: 76, name: '16', lockerRoomId: 4 },
      { id: 77, name: '17', lockerRoomId: 4 },
      { id: 78, name: '18', lockerRoomId: 4 },
      { id: 79, name: '19', lockerRoomId: 4 },
      { id: 80, name: '20', lockerRoomId: 4 },
      { id: 81, name: '1', lockerRoomId: 5 },
      { id: 82, name: '2', lockerRoomId: 5 },
      { id: 83, name: '3', lockerRoomId: 5 },
      { id: 84, name: '4', lockerRoomId: 5 },
      { id: 85, name: '5', lockerRoomId: 5 },
      { id: 86, name: '6', lockerRoomId: 5 },
      { id: 87, name: '7', lockerRoomId: 5 },
      { id: 88, name: '8', lockerRoomId: 5 },
      { id: 89, name: '9', lockerRoomId: 5 },
      { id: 90, name: '10', lockerRoomId: 5 },
    ],
  });

  return await prisma.locker.findMany({ orderBy: { id: 'asc' } });
}

export async function seedLockerActionLog(prisma: PrismaClient) {
  if ((await prisma.lockerAction.count()) === 0) {
    await seedLockerAction(prisma);
  }

  if ((await prisma.locker.count()) === 0) {
    await seedLocker(prisma);
  }

  const assignAction = await prisma.lockerAction.findFirstOrThrow({
    where: { name: 'assign' },
  });
  const releaseAction = await prisma.lockerAction.findFirstOrThrow({
    where: { name: 'release' },
  });

  // 현재 시간을 기준으로 로그 생성
  const now = new Date();

  // 1. 10개의 로커에 대해 3번씩 assign/release 반복
  const actionLogs = [];
  for (let lockerId = 1; lockerId <= 10; lockerId++) {
    for (let i = 0; i < 3; i++) {
      const assignDate = new Date(
        now.getTime() - (30 - i * 2) * 24 * 60 * 60 * 1000
      );
      const releaseDate = new Date(assignDate.getTime() + 24 * 60 * 60 * 1000);

      actionLogs.push(
        {
          lockerId,
          actionId: assignAction.id,
          createdAt: assignDate,
          userId: `user${lockerId}`,
        },
        {
          lockerId,
          actionId: releaseAction.id,
          createdAt: releaseDate,
          userId: `user${lockerId}`,
        }
      );
    }
  }

  // 2. id가 1-5번인 로커에 대해 추가 assign 액션 생성
  for (let lockerId = 1; lockerId <= 5; lockerId++) {
    actionLogs.push({
      lockerId,
      actionId: assignAction.id,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1일 전
      userId: `user${lockerId}`,
    });
  }

  // LockerActionLog 생성
  await prisma.lockerActionLog.createMany({
    data: actionLogs,
  });

  return await prisma.lockerActionLog.findMany({ orderBy: { id: 'asc' } });
}
