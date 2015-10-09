DROP DATABASE IF EXISTS bankonline;

CREATE DATABASE bankonline;

USE bankonline;

CREATE TABLE `customers` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(65) NOT NULL,
	`suffix` VARCHAR(5),
	`balance` INT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `transactions` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `from` INT UNSIGNED NOT NULL,
    `to` INT UNSIGNED NOT NULL,
    `amount` INT NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `idx_from_customer` (`from` ASC),
	CONSTRAINT `idx_from_customer`
		FOREIGN KEY (`from`)
		REFERENCES `customers` (`id`),
	INDEX `idx_to_customer` (`to` ASC),
	CONSTRAINT `idx_to_customer`
		FOREIGN KEY (`to`)
		REFERENCES `customers` (`id`)
);

INSERT INTO customers (`name`, `balance`) values
 ('Charles',  '100'),
 ('Mike',     '100'),
 ('Nick',     '100'),
 ('Samantha', '100'),
 ('Ben',      '100'),
 ('Joe',      '100'),
 ('Darren',   '100');

