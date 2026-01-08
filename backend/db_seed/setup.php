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

    // Cria a tabela correta
    $sql = "CREATE TABLE IF NOT EXISTS pessoas (
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

    $pdo->exec($sql);
    echo "Tabela 'pessoas' criada com sucesso.<br>";

    echo "<br><b>SUCESSO!</b> Banco de dados pronto.";

} catch (PDOException $e) {
    die("<b>ERRO:</b> " . $e->getMessage());
}
