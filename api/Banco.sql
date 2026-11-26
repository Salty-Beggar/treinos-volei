CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);


CREATE TABLE treino (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    tempo INT NOT NULL,
    series INT NOT NULL,
    intervalo INT NOT NULL,
    repeticoes INT NOT NULL,
    video VARCHAR(255),
    CONSTRAINT fk_treino_usuario FOREIGN KEY (user_id)
        REFERENCES usuario (id) ON DELETE CASCADE
);


CREATE TABLE historico_treino (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    duracao_minutos INT NOT NULL,
    data_execucao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historico_usuario FOREIGN KEY (user_id)
        REFERENCES usuario (id) ON DELETE CASCADE
);


CREATE TABLE streak (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dia DATE NOT NULL,
    feito BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_streak_usuario FOREIGN KEY (user_id)
        REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT uq_user_dia UNIQUE (user_id, dia)
);
