<?php
// backend/api/reset_password.php

require_once __DIR__ . '/config.php';

 $email_alvo = 'admin@ibvrd.com.br'; // O email que você está usando
 $nova_senha = '123456'; // A senha que você quer DEFINIR

try {
    // 1. Verificar se o usuário existe
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email_alvo]);
    $user = $stmt->fetch();

    if ($user) {
        // 2. Gerar o hash NOVO e CORRETO
        $novo_hash = password_hash($nova_senha, PASSWORD_DEFAULT);
        
        // 3. Atualizar no banco
        $update = $pdo->prepare("UPDATE users SET password = :pass WHERE id = :id");
        $update->execute([
            ':pass' => $novo_hash,
            ':id' => $user['id']
        ]);
        
        echo "<h1>Senha Resetada com Sucesso!</h1>";
        echo "<p><strong>Email:</strong> " . htmlspecialchars($email_alvo) . "</p>";
        echo "<p><strong>Nova Senha:</strong> " . htmlspecialchars($nova_senha) . "</p>";
        echo "<p><strong>Novo Hash no Banco:</strong> " . $novo_hash . "</p>";
        echo "<p><em>Apague este arquivo do servidor agora.</em></p>";
    } else {
        echo "<h1>Erro</h1>";
        echo "<p>Usuário " . htmlspecialchars($email_alvo) . " não encontrado no banco de dados.</p>";
        echo "<p>Verifique se o arquivo .env do servidor está conectando no banco correto.</p>";
    }

} catch (Exception $e) {
    echo "<h1>Erro de Sistema</h1>";
    echo "<p>" . $e->getMessage() . "</p>";
}