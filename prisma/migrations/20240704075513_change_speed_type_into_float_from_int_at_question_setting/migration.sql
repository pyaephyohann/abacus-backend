/*
  Warnings:

  - You are about to alter the column `speed` on the `questionsetting` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `questionsetting` MODIFY `speed` DOUBLE NOT NULL;
