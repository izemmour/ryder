CREATE TABLE `landing_page_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageId` varchar(100) NOT NULL,
	`colorScheme` varchar(50),
	`ctaText` varchar(100),
	`redirectUrl` varchar(500),
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landing_page_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `landing_page_settings_pageId_unique` UNIQUE(`pageId`)
);
