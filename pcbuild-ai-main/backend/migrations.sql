-- Migrations: create normalized schema for PC Builder (safe, idempotent)
-- Uses IF NOT EXISTS so it won't overwrite existing tables.

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `preferences` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `components` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(50) NOT NULL,
  `brand` VARCHAR(100) NULL,
  `model` VARCHAR(200) NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `watt` INT NULL,
  `stock_status` ENUM('in_stock','out_of_stock') DEFAULT 'in_stock',
  `specs_json` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `builds` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `fps` INT NULL,
  `wattage` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `build_components` (
  `build_id` INT NOT NULL,
  `component_id` INT NOT NULL,
  PRIMARY KEY (`build_id`,`component_id`),
  FOREIGN KEY (`build_id`) REFERENCES `builds`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`component_id`) REFERENCES `components`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `stores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `store_name` VARCHAR(200) NOT NULL,
  `store_location` VARCHAR(200) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `store_availability` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `store_id` INT NOT NULL,
  `component_id` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `stock_status` ENUM('in_stock','out_of_stock') DEFAULT 'in_stock',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`component_id`) REFERENCES `components`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `post_id` INT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `budgets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Example view: build summary with total components count
CREATE OR REPLACE VIEW `build_summary` AS
SELECT b.id AS build_id, b.user_id, b.total_price, b.fps, b.wattage, COUNT(bc.component_id) AS component_count
FROM builds b
LEFT JOIN build_components bc ON b.id = bc.build_id
GROUP BY b.id;

-- Stored procedure example: returns average price for a category
DROP PROCEDURE IF EXISTS avg_component_price_by_category;
DELIMITER $$
CREATE PROCEDURE avg_component_price_by_category(IN cat VARCHAR(50))
BEGIN
  SELECT AVG(price) AS avg_price FROM components WHERE category = cat;
END$$
DELIMITER ;

-- Trigger example: keep `components` updated_at timestamp
DROP TRIGGER IF EXISTS components_before_update;
DELIMITER $$
CREATE TRIGGER components_before_update
BEFORE UPDATE ON components
FOR EACH ROW
BEGIN
  SET NEW.created_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;
