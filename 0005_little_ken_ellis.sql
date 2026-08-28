CREATE TABLE `brand_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(160) NOT NULL,
	`logoUrl` varchar(600),
	`websiteUrl` varchar(600),
	`specialtyEn` varchar(300),
	`specialtyUz` varchar(300),
	`specialtyRu` varchar(300),
	`descriptionEn` text,
	`descriptionUz` text,
	`descriptionRu` text,
	`status` enum('draft','approved','rejected') NOT NULL DEFAULT 'draft',
	`createdBy` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brand_submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `brand_submissions_slug_unique` UNIQUE(`slug`)
);
