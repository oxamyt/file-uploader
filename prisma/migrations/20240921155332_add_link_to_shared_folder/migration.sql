/*
  Warnings:

  - A unique constraint covering the columns `[linkId]` on the table `SharedFolder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `linkId` to the `SharedFolder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SharedFolder" ADD COLUMN     "linkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SharedFolder_linkId_key" ON "SharedFolder"("linkId");
