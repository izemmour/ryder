CREATE TABLE `color_schemes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(150) NOT NULL,
	`primaryColor` varchar(7) NOT NULL,
	`secondaryColor` varchar(7) NOT NULL,
	`accentColor` varchar(7) NOT NULL,
	`accentDarkColor` varchar(7) NOT NULL,
	`backgroundColor` varchar(7) NOT NULL,
	`secondaryLightColor` varchar(7) NOT NULL,
	`description` text,
	`sortOrder` int DEFAULT 0,
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `color_schemes_id` PRIMARY KEY(`id`),
	CONSTRAINT `color_schemes_slug_unique` UNIQUE(`slug`)
);
