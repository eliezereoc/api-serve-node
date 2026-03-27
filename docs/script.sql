-- Script SQL manual equivalente à migration:
-- migrations/20240911000000_create_usuario_table.js
-- Banco alvo: MySQL / MariaDB

CREATE TABLE IF NOT EXISTS usuario (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha VARCHAR(150) NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    active CHAR(1) DEFAULT 'S',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_alteracao TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY usuario_unique (usuario),
    UNIQUE KEY email_unico (email)
);

INSERT INTO usuario (
    nome,
    email,
    senha,
    active,
    usuario
)
SELECT
    'Admin',
    'admin@admin.com',
    '$2b$10$WKSqg4.cu8E9MSMWfJt1S.NU8atk0rU51crKhRIbIX4K8YfviUrQy',
    'S',
    'admin.admin'
WHERE NOT EXISTS (
    SELECT 1
    FROM usuario
    WHERE usuario = 'admin.admin'
);
