CREATE TABLE `cta_buttons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`text` varchar(100) NOT NULL,
	`url` varchar(500) NOT NULL,
	`variant` varchar(50) DEFAULT 'primary',
	`isDefault` int DEFAULT 0,
	`description` text,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cta_buttons_id` PRIMARY KEY(`id`)
);
