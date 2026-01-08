setup.php<?php
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

    // Cria a tabela se não existir
    $sql = "CREATE TABLE IF NOT EXISTS pessoas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_completo TEXT NOT NULL,
        data_nascimento TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT NOT NULL,
        endereco TEXT NOT NULL,
        tipo TEXT NOT NULL DEFAULT 'Visitante',
        ministerio TEXT NOT NULL DEFAULT 'Nenhum',
        observacoes TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($sql);
    echo "Tabela 'pessoas' criada com sucesso.<br>";

    // Verifica se já tem dados
    $count = $pdo->query("SELECT count(*) FROM pessoas")->fetchColumn();
    if ($count == 0) {
        echo "Inserindo dados de exemplo...<br>";
        $stmt = $pdo->prepare("INSERT INTO pessoas (nome_completo, data_nascimento, telefone, email, endereco, tipo, ministerio) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['Hugo Wenner', '1990-05-20', '11999999999', 'hugo@teste.com', 'Rua Local, 123', 'Membro', 'Louvor']);
        echo "Dados de exemplo inseridos.<br>";
    } else {
        echo "Banco já contém " . $count . " registros.<br>";
    }

    echo "<br><b>SUCESSO!</b> Banco de dados pronto.";

} catch (PDOException $e) {
    die("<b>ERRO:</b> " . $e->getMessage());
}
?>