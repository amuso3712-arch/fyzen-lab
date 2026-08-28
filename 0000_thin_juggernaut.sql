CREATE TABLE `order_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` varchar(32) NOT NULL,
	`customerName` varchar(200) NOT NULL,
	`customerPhone` varchar(80) NOT NULL,
	`organization` varchar(300),
	`notes` text,
	`itemsJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `order_requests_requestId_unique` UNIQUE(`requestId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
