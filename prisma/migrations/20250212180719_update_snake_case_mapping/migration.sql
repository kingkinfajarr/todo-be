/*
  Warnings:

  - You are about to drop the `SubTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubTask" DROP CONSTRAINT "SubTask_taskId_fkey";

-- DropTable
DROP TABLE "SubTask";

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "is_due" BOOLEAN NOT NULL DEFAULT false,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "sub_tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sub_tasks" ADD CONSTRAINT "sub_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
