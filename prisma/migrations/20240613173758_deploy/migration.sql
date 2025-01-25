-- CreateTable
CREATE TABLE `AbacusUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `otpCode` INTEGER NULL,
    `otpSendTimes` JSON NULL,
    `otpCreatedAt` DATETIME(3) NULL,
    `assetUrl` VARCHAR(191) NULL,
    `accessToken` VARCHAR(1024) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AbacusUsers_username_key`(`username`),
    UNIQUE INDEX `AbacusUsers_phone_key`(`phone`),
    UNIQUE INDEX `AbacusUsers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `row` INTEGER NOT NULL,
    `digit` INTEGER NOT NULL,
    `breakTime` INTEGER NOT NULL,
    `showType` ENUM('CALCULATION', 'LISTENING', 'FLASHCARD') NOT NULL,
    `speed` INTEGER NOT NULL,
    `round` INTEGER NOT NULL,
    `isComplete` BOOLEAN NOT NULL DEFAULT false,
    `isExam` BOOLEAN NOT NULL DEFAULT false,
    `examTime` DATETIME(3) NULL,
    `examName` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `questionSettingId` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` INTEGER NOT NULL,
    `userAnswer` INTEGER NULL,
    `roundNumber` INTEGER NOT NULL,
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,
    `isCorrect` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavedQuestionSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `questionSettingId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyQuestions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('SINGLE_CHOICE', 'MULTIPLE_CHOICE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyAnswers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `questionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyUserResponses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `answerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Levels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `digit` INTEGER NOT NULL,
    `row` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `order` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isArchived` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuestionSetting` ADD CONSTRAINT `QuestionSetting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `AbacusUsers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questions` ADD CONSTRAINT `Questions_questionSettingId_fkey` FOREIGN KEY (`questionSettingId`) REFERENCES `QuestionSetting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedQuestionSettings` ADD CONSTRAINT `SavedQuestionSettings_questionSettingId_fkey` FOREIGN KEY (`questionSettingId`) REFERENCES `QuestionSetting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyAnswers` ADD CONSTRAINT `SurveyAnswers_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `SurveyQuestions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyUserResponses` ADD CONSTRAINT `SurveyUserResponses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `AbacusUsers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyUserResponses` ADD CONSTRAINT `SurveyUserResponses_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `SurveyQuestions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyUserResponses` ADD CONSTRAINT `SurveyUserResponses_answerId_fkey` FOREIGN KEY (`answerId`) REFERENCES `SurveyAnswers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
