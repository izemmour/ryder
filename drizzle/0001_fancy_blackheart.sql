CREATE TABLE `landing_page_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageId` varchar(128) NOT NULL,
	`date` varchar(10) NOT NULL,
	`pageViews` int NOT NULL DEFAULT 0,
	`uniqueVisitors` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`conversionRate` int NOT NULL DEFAULT 0,
	`avgTimeOnPage` int NOT NULL DEFAULT 0,
	`bounceRate` int NOT NULL DEFAULT 0,
	`syncedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landing_page_analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `landing_page_metadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageId` varchar(128) NOT NULL,
	`pageType` enum('home','use-case','angle','event','quiz') NOT NULL,
	`sectionCount` int NOT NULL DEFAULT 0,
	`faqCount` int NOT NULL DEFAULT 0,
	`wordCount` int NOT NULL DEFAULT 0,
	`testimonialCount` int NOT NULL DEFAULT 0,
	`benefitCount` int NOT NULL DEFAULT 0,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`computedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landing_page_metadata_id` PRIMARY KEY(`id`),
	CONSTRAINT `landing_page_metadata_pageId_unique` UNIQUE(`pageId`)
);
--> statement-breakpoint
CREATE TABLE `landing_page_screenshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageId` varchar(128) NOT NULL,
	`pageType` enum('home','use-case','angle','event','quiz') NOT NULL,
	`screenshotUrl` text NOT NULL,
	`screenshotKey` varchar(512) NOT NULL,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landing_page_screenshots_id` PRIMARY KEY(`id`),
	CONSTRAINT `landing_page_screenshots_pageId_unique` UNIQUE(`pageId`)
);
