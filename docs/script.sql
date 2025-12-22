mysqldump -u root -p '' --databases db_api_dev > backup.sql

SHOW CREATE TABLE usuario;

-- ****************************** BACKUP ****************************--

CREATE TABLE IF NOT EXISTS usuario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,   
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(20) UNIQUE NOT NULL,
    senha VARCHAR(150) NOT NULL
);

INSERT INTO usuario (nome, email, senha) VALUES ('eliezer', 'eliezeroc@gmail.com', 'admin');
-- ****************************** 11/09/2024 ****************************--

ALTER TABLE usuario
ADD COLUMN active CHAR(1) DEFAULT 'S',
ADD COLUMN data_criacao DATE DEFAULT CURRENT_DATE,
ADD COLUMN data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
-- ****************************** 12/09/2024 ****************************--

ALTER TABLE `usuario`
MODIFY `data_criacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
MODIFY `data_alteracao` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE usuario
ADD CONSTRAINT email_unico UNIQUE (email);

ALTER TABLE usuario
ADD COLUMN usuario VARCHAR(50) NOT NULL UNIQUE;

INSERT INTO usuario (nome, email, senha, active, usuario) 
VALUES ('Admin', 'admin@admin.com', '$2b$10$WKSqg4.cu8E9MSMWfJt1S.NU8atk0rU51crKhRIbIX4K8YfviUrQy', 'S', 'admin.admin'); 

ALTER TABLE usuario
MODIFY email CHAR(150) NOT NULL;
-- ****************************** 15/02/2025 ****************************--




