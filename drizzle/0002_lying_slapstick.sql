CREATE TABLE `product_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(40) NOT NULL,
	`name` varchar(240) NOT NULL,
	`nameUz` varchar(240),
	`nameRu` varchar(240),
	`nameEn` varchar(240),
	`brand` varchar(160) NOT NULL,
	`category` varchar(80) NOT NULL,
	`price` varchar(80),
	`description` text,
	`imageUrl` varchar(600),
	`status` enum('draft','approved','rejected') NOT NULL DEFAULT 'draft',
	`createdBy` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_submissions_productId_unique` UNIQUE(`productId`)
);
