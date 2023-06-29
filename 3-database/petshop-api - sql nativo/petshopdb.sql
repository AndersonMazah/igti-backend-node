CREATE DATABASE petshop;

CREATE TABLE proprietarios (
    proprietario_id SERIAL PRIMARY KEY NOT NULL,
    nome VARCHAR NOT NULL,
    telefone VARCHAR NOT NULL
);

CREATE TABLE animais (
    animal_id SERIAL PRIMARY KEY NOT NULL,
	proprietario_id INT NOT NULL,
    nome VARCHAR NOT NULL,
    tipo VARCHAR NOT NULL,
    CONSTRAINT fk_suppliers FOREIGN KEY (proprietario_id) REFERENCES proprietario (proprietario_id)
);
