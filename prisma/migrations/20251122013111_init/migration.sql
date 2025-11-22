-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `handle` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `authorizationCode` VARCHAR(191) NULL,
    `accessToken` LONGTEXT NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Company_id_key`(`id`),
    UNIQUE INDEX `Company_handle_key`(`handle`),
    INDEX `Company_id_idx`(`id`),
    INDEX `Company_handle_idx`(`handle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
