CREATE TABLE `options` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`label` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE INDEX `idx_options_session` ON `options` (`session_id`);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`question` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text NOT NULL
);

--> statement-breakpoint
CREATE INDEX `idx_sessions_owner_created` ON `sessions` (`owner_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`option_id` text NOT NULL,
	`voter_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`option_id`) REFERENCES `options`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE UNIQUE INDEX `idx_votes_session_voter` ON `votes` (`session_id`,`voter_id`);
--> statement-breakpoint
CREATE INDEX `idx_votes_option` ON `votes` (`option_id`);