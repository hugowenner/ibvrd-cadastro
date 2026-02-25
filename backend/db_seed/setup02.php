<?php
// backend/db_seed/setup.php

$dbDir  = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'database';
$dbFile = $dbDir . DIRECTORY_SEPARATOR . 'ibvrd.sqlite';

// CSV (ajuste se mudar o nome)
$csvFile = __DIR__ . DIRECTORY_SEPARATOR . 'usuarios.csv';

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
    $adminNome = "Administrador";
    $adminEmail = "admin@ibvrd.com.br";
    $adminSenhaPlana = "123456";

    $senhaHash = password_hash($adminSenhaPlana, PASSWORD_DEFAULT);
    $token = bin2hex(random_bytes(32));

    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$adminEmail]);

    if ($checkStmt->fetch()) {
        echo "⚠️ Usuário Admin já existe. Não foi criado novamente.<br>";
    } else {
        $insertStmt = $pdo->prepare("INSERT INTO users (nome, email, password, api_token) VALUES (?, ?, ?, ?)");
        if ($insertStmt->execute([$adminNome, $adminEmail, $senhaHash, $token])) {
            echo "✅ Usuário Admin criado com sucesso!<br>";
            echo "&nbsp;&nbsp;📧 Email: <b>" . $adminEmail . "</b><br>";
            echo "&nbsp;&nbsp;🔑 Senha: <b>" . $adminSenhaPlana . "</b><br>";
        }
    }

    // ==========================================
    // 4. IMPORTA usuarios.csv -> pessoas
    // ==========================================
    if (!file_exists($csvFile)) {
        echo "⚠️ CSV não encontrado em: <b>$csvFile</b><br>";
    } else {
        // Se quiser sempre "recriar do zero" os registros:
        // (comente essas 2 linhas se não quiser apagar)
        $pdo->exec("DELETE FROM pessoas;");
        $pdo->exec("DELETE FROM sqlite_sequence WHERE name='pessoas';");

        $handle = fopen($csvFile, 'r');
        if (!$handle) {
            throw new Exception("Não foi possível abrir o CSV: $csvFile");
        }

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO pessoas
            (nome_completo, data_nascimento, telefone, email, endereco, tipo, ministerio, observacoes)
            VALUES
            (:nome, :nasc, :tel, :email, :end, :tipo, :min, :obs)
        ");

        $linhas = 0;
        $inseridos = 0;

        while (($row = fgetcsv($handle, 0, ';')) !== false) {
            $linhas++;

            // remove espaços e colunas vazias no final (por causa do ; no fim)
            $row = array_map(fn($v) => is_string($v) ? trim($v) : $v, $row);
            while (count($row) > 0 && end($row) === '') array_pop($row);

            // pula linha vazia
            if (count($row) === 0) continue;

            // Se tiver header (nome;data_nascimento;...), pula
            if ($linhas === 1 && isset($row[0]) && str_contains(mb_strtolower($row[0]), 'nome')) {
                continue;
            }

            // Esperado: 8 colunas
            // 0 nome, 1 nasc, 2 tel, 3 email, 4 endereco, 5 tipo, 6 ministerio, 7 observacoes
            $nome = $row[0] ?? '';
            if ($nome === '') continue;

            $nasc = $row[1] ?? null;
            $tel  = $row[2] ?? null;
            $email = $row[3] ?? null;
            $end  = $row[4] ?? null;
            $tipo = $row[5] ?? 'Visitante';
            $min  = $row[6] ?? null;
            $obs  = $row[7] ?? null;

            // normalizações simples
            $email = $email ? mb_strtolower($email) : null;
            $tel = $tel ? preg_replace('/\D+/', '', $tel) : null; // só números

            $stmt->execute([
                ':nome' => $nome,
                ':nasc' => $nasc,
                ':tel'  => $tel,
                ':email'=> $email,
                ':end'  => $end,
                ':tipo' => $tipo ?: 'Visitante',
                ':min'  => $min,
                ':obs'  => $obs,
            ]);

            $inseridos++;
        }

        fclose($handle);
        $pdo->commit();

        echo "✅ Importação concluída: <b>$inseridos</b> registros inseridos em 'pessoas'.<br>";
    }

    echo "<br><h3>SUCESSO!</h3> Banco de dados configurado.";

} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    die("<b>ERRO:</b> " . $e->getMessage());
}