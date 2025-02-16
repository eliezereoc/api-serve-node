mysqldump -u root -p '' --databases db_api_dev > backup.sql

-- ****************************** BACKUP ****************************--

CREATE TABLE IF NOT EXISTS usuario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,   
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(20) UNIQUE NOT NULL,
    senha VARCHAR(150) NOT NULL
);

INSERT INTO usuario (nome, email, senha) VALUES ('eliezer', 'eliezeroc@gmail.com', 'admin');
SELECT * FROM usuario;

-- ****************************** 11/09/2024 ****************************--

ALTER TABLE usuario
ADD COLUMN active CHAR(1) DEFAULT 'S',
ADD COLUMN data_criacao DATE DEFAULT CURRENT_DATE,
ADD COLUMN data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
-- ****************************** 12/09/2024 ****************************--

ALTER TABLE `usuario`
MODIFY `data_criacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
MODIFY `data_alteracao` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;
-- ****************************** 15/02/2025 ****************************--




