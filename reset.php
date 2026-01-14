<?php
// backend/api/reset.php

// Inclui a configuração do banco de dados que você ajustou
require_once 'config.php';

// Define a nova senha desejada
 $novaSenhaTexto = '123456';

// Gera o hash criptografado (igual ao que o sistema usa para cadastrar)
 $hashSenha = password_hash($novaSenhaTexto, PASSWORD_DEFAULT);

// Atualiza no banco de dados na tabela 'users' (coluna 'password')
 $sql = "UPDATE users SET password = :hash WHERE email = 'admin@ibvrd.com.br'";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':hash' => $hashSenha]);

    echo "<h1>✅ Senha Resetada com Sucesso!</h1>";
    echo "<p>A senha do usuário <strong>admin@ibvrd.com.br</strong> agora é: <strong>123456</strong>.</p>";
    echo "<p>Hash gerado: $hashSenha</p>";
    echo "<br><strong style='color: red;'>IMPORTANTE: Delete este arquivo (reset.php) agora!</strong>";

} catch (Exception $e) {
    echo "Erro ao resetar: " . $e->getMessage();
}
?>