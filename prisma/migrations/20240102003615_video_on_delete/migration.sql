-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_createdById_fkey`;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
