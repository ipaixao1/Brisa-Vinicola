-- Script gerado a partir dos modelos da API (backend/app/models.py)
CREATE DATABASE IF NOT EXISTS brisa_vinicola
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE brisa_vinicola;

CREATE TABLE contact_messages (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	name VARCHAR(120) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	subject VARCHAR(200) NOT NULL, 
	message TEXT NOT NULL, 
	created_at DATETIME NOT NULL, 
	answered BOOL NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE users (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	name VARCHAR(120) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	password_hash VARCHAR(255) NOT NULL, 
	is_admin BOOL NOT NULL DEFAULT '0', 
	created_at DATETIME NOT NULL, 
	PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_users_email ON users (email);

CREATE TABLE wines (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	name VARCHAR(150) NOT NULL, 
	producer VARCHAR(150) NOT NULL, 
	type VARCHAR(20) NOT NULL, 
	grape VARCHAR(80) NOT NULL, 
	origin VARCHAR(80) NOT NULL, 
	price NUMERIC(10, 2) NOT NULL, 
	price_old NUMERIC(10, 2), 
	img VARCHAR(255) NOT NULL, 
	badge VARCHAR(40), 
	featured BOOL NOT NULL, 
	date INTEGER NOT NULL, 
	description TEXT NOT NULL, 
	alcohol VARCHAR(20) NOT NULL, 
	acidity VARCHAR(20) NOT NULL, 
	volume VARCHAR(20) NOT NULL, 
	serving_temp VARCHAR(40) NOT NULL, 
	traits JSON NOT NULL, 
	pairings JSON NOT NULL, 
	PRIMARY KEY (id)
);

CREATE INDEX ix_wines_grape ON wines (grape);

CREATE INDEX ix_wines_type ON wines (type);

CREATE TABLE addresses (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	user_id INTEGER NOT NULL, 
	recipient VARCHAR(120) NOT NULL, 
	cep VARCHAR(20) NOT NULL, 
	street VARCHAR(200) NOT NULL, 
	number VARCHAR(20) NOT NULL, 
	complement VARCHAR(100) NOT NULL, 
	neighborhood VARCHAR(100) NOT NULL, 
	city VARCHAR(100) NOT NULL, 
	state VARCHAR(2) NOT NULL, 
	reference VARCHAR(200) NOT NULL, 
	is_primary BOOL NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE INDEX ix_addresses_user_id ON addresses (user_id);

CREATE TABLE cards (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	user_id INTEGER NOT NULL, 
	brand VARCHAR(20) NOT NULL, 
	last4 VARCHAR(4) NOT NULL, 
	holder_name VARCHAR(120) NOT NULL, 
	expiry VARCHAR(5) NOT NULL, 
	is_primary BOOL NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE INDEX ix_cards_user_id ON cards (user_id);

CREATE TABLE orders (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	code VARCHAR(20) NOT NULL, 
	user_id INTEGER NOT NULL, 
	created_at DATETIME NOT NULL, 
	subtotal NUMERIC(10, 2) NOT NULL, 
	frete NUMERIC(10, 2) NOT NULL, 
	total NUMERIC(10, 2) NOT NULL, 
	pay_method VARCHAR(20) NOT NULL, 
	installments INTEGER NOT NULL, 
	status_index INTEGER NOT NULL, 
	cep VARCHAR(20) NOT NULL, 
	street VARCHAR(200) NOT NULL, 
	number VARCHAR(20) NOT NULL, 
	complement VARCHAR(100) NOT NULL, 
	district VARCHAR(100) NOT NULL, 
	city VARCHAR(100) NOT NULL, 
	state VARCHAR(2) NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE UNIQUE INDEX ix_orders_code ON orders (code);

CREATE INDEX ix_orders_user_id ON orders (user_id);

CREATE TABLE order_items (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	order_id INTEGER NOT NULL, 
	wine_id INTEGER NOT NULL, 
	quantity INTEGER NOT NULL, 
	unit_price NUMERIC(10, 2) NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(order_id) REFERENCES orders (id), 
	FOREIGN KEY(wine_id) REFERENCES wines (id)
);

CREATE INDEX ix_order_items_order_id ON order_items (order_id);
