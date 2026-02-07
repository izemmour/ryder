CREATE TABLE `marketing_angles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(150) NOT NULL,
	`productTitle` varchar(255),
	`tags` text,
	`description` text,
	`colorScheme` varchar(50),
	`sortOrder` int DEFAULT 0,
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketing_angles_id` PRIMARY KEY(`id`),
	CONSTRAINT `marketing_angles_slug_unique` UNIQUE(`slug`)
);
