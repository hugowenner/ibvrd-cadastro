-- Tabela de usuários para login
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    api_token TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- OBS: Para a primeira versão em SQLite/MySQL, 
-- você precisará inserir um usuário manualmente com a senha hashada.
-- Exemplo de hash para a senha '123456': $2y$10$YourHashedPasswordHere...
-- Recomendo criar um script PHP auxiliar para gerar o primeiro hash se não souber.