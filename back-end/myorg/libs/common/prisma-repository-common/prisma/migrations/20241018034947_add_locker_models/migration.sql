-- CreateTable
CREATE TABLE "locker_rooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "locker_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lockers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lockerRoomId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lockers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LockerAction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LockerAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LockerActionLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockerId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,
    "userId" TEXT,
    "reservationId" INTEGER,
    "reason" TEXT,

    CONSTRAINT "LockerActionLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lockers" ADD CONSTRAINT "lockers_lockerRoomId_fkey" FOREIGN KEY ("lockerRoomId") REFERENCES "locker_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockerActionLog" ADD CONSTRAINT "LockerActionLog_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "lockers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockerActionLog" ADD CONSTRAINT "LockerActionLog_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "LockerAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
