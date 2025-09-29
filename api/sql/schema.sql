-- PROG2002 A2 - Charity Events schema

CREATE DATABASE IF NOT EXISTS charityevents_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE charityevents_db;

-- drop child first
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

-- organizations
CREATE TABLE organizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  mission TEXT,
  email VARCHAR(200),
  phone VARCHAR(50),
  website VARCHAR(255),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- events
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  purpose VARCHAR(255),
  description TEXT,
  location VARCHAR(200) NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  image_url VARCHAR(300),
  ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  goal_amount DECIMAL(12,2) DEFAULT 0.00,
  raised_amount DECIMAL(12,2) DEFAULT 0.00,
  is_suspended TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_events_cat FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_events_dates (start_datetime, end_datetime),
  INDEX idx_events_category (category_id),
  INDEX idx_events_org (org_id)
) ENGINE=InnoDB;
