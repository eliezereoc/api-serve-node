CREATE TABLE IF NOT EXISTS usuario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(20) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    senha VARCHAR(150) NOT NULL
);

INSERT INTO usuario (usuario, nome, senha) VALUES ('admin', 'Administrador', 'admin');

SELECT * FROM usuario;





