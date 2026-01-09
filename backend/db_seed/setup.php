<?php
// backend/db_seed/setup.php

 $dbDir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'database';
 $dbFile = $dbDir . DIRECTORY_SEPARATOR . 'ibvrd.sqlite';

// Garante que a pasta database existe
if (!is_dir($dbDir)) {
    mkdir($dbDir, 0777, true);
}

try {
    $pdo = new PDO("sqlite:" . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Conectando a: " . $dbFile . "<br>";

    // ==========================================
    // 1. Cria a tabela de Pessoas
    // ==========================================
    $sqlPessoas = "CREATE TABLE IF NOT EXISTS pessoas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_completo TEXT NOT NULL,
        data_nascimento TEXT,
        telefone TEXT,
        email TEXT,
        endereco TEXT,
        tipo TEXT NOT NULL DEFAULT 'Visitante',
        ministerio TEXT,
        observacoes TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($sqlPessoas);
    echo "✅ Tabela 'pessoas' verificada/criada.<br>";

    // ==========================================
    // 2. Cria a tabela de Usuários (Login)
    // ==========================================
    $sqlUsers = "CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        api_token TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($sqlUsers);
    echo "✅ Tabela 'users' verificada/criada.<br>";

    // ==========================================
    // 3. Cria o Usuário Administrador Padrão
    // ==========================================
    
    // Dados do Admin Padrão
    $adminNome = "Administrador";
    $adminEmail = "admin@ibvrd.com.br"; 
    $adminSenhaPlana = "123456"; // Senha inicial
    
    // Gera o hash da senha (segurança)
    $senhaHash = password_hash($adminSenhaPlana, PASSWORD_DEFAULT);
    
    // Gera um token inicial
    $token = bin2hex(random_bytes(32));

    // Verifica se já existe para não duplicar
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$adminEmail]);
    
    if ($checkStmt->fetch()) {
        echo "⚠️ Usuário Admin já existe. Não foi criado novamente.<br>";
    } else {
        // Insere o novo usuário
        $insertStmt = $pdo->prepare("INSERT INTO users (nome, email, password, api_token) VALUES (?, ?, ?, ?)");
        if ($insertStmt->execute([$adminNome, $adminEmail, $senhaHash, $token])) {
            echo "✅ Usuário Admin criado com sucesso!<br>";
            echo "   &nbsp;&nbsp;📧 Email: <b>" . $adminEmail . "</b><br>";
            echo "   &nbsp;&nbsp;🔑 Senha: <b>" . $adminSenhaPlana . "</b><br>";
        }
    }

    echo "<br><h3>SUCESSO!</h3> Banco de dados configurado.";

} catch (PDOException $e) {
    die("<b>ERRO:</b> " . $e->getMessage());
}