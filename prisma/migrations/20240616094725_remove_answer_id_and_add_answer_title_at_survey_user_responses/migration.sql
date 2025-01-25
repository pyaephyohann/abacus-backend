/*
  Warnings:

  - You are about to drop the column `answerId` on the `surveyuserresponses` table. All the data in the column will be lost.
  - Added the required column `answerTitle` to the `SurveyUserResponses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `surveyuserresponses` DROP FOREIGN KEY `SurveyUserResponses_answerId_fkey`;

-- AlterTable
ALTER TABLE `surveyuserresponses` DROP COLUMN `answerId`,
    ADD COLUMN `answerTitle` VARCHAR(191) NOT NULL;
