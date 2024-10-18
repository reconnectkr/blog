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
CREATE TABLE "locker_actions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "locker_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locker_action_logs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockerId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,
    "userId" TEXT,
    "reservationId" INTEGER,
    "reason" TEXT,

    CONSTRAINT "locker_action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "locker_actions_name_idx" ON "locker_actions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "locker_actions_name_key" ON "locker_actions"("name");

-- AddForeignKey
ALTER TABLE "lockers" ADD CONSTRAINT "lockers_lockerRoomId_fkey" FOREIGN KEY ("lockerRoomId") REFERENCES "locker_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locker_action_logs" ADD CONSTRAINT "locker_action_logs_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "lockers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locker_action_logs" ADD CONSTRAINT "locker_action_logs_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "locker_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
