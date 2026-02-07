ALTER TABLE `landing_page_settings` ADD `galleryImages` text;--> statement-breakpoint
ALTER TABLE `landing_page_settings` ADD `subSentence` text;--> statement-breakpoint
ALTER TABLE `landing_page_settings` ADD `generatedColorScheme` varchar(50);--> statement-breakpoint
ALTER TABLE `landing_page_settings` ADD `lastComplianceCheck` timestamp;--> statement-breakpoint
ALTER TABLE `landing_page_settings` ADD `complianceIssues` text;--> statement-breakpoint
ALTER TABLE `landing_page_settings` ADD `autoFixAvailable` int DEFAULT 0;