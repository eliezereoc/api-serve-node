CREATE TABLE IF NOT EXISTS usuario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,   
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(20) UNIQUE NOT NULL,
    senha VARCHAR(150) NOT NULL
);

INSERT INTO usuario (nome, email, senha) VALUES ('eliezer', 'eliezeroc@gmail.com', 'admin');
SELECT * FROM usuario;

-- ****************************** 11/09/2024 ****************************--





