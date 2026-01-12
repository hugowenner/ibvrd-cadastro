<?php
// backend/api/auth.php

// ===============================
// INCLUDE CONFIG (CORS E DB)
// ===============================
require_once __DIR__ . '/config.php';

// ===============================
// APENAS POST
// ===============================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Método não permitido'
    ]);
    exit;
}

// ===============================
// INPUT JSON
// ===============================
 $rawInput = file_get_contents('php://input');
 $input = json_decode($rawInput, true);

if (!$input || empty($input['email']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Email e senha são obrigatórios'
    ]);
    exit;
}

 $email = trim($input['email']);
 $password = $input['password'];

try {
    // ===============================
    // BUSCAR USUÁRIO
    // ===============================
    $stmt = $pdo->prepare("
        SELECT id, nome, email, password
        FROM users
        WHERE email = :email
        LIMIT 1
    ");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // ===============================
    // VERIFICA CREDENCIAIS
    // ===============================
    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Credenciais inválidas'
        ]);
        exit;
    }

    // ===============================
    // GERAR NOVO TOKEN
    // ===============================
    $token = bin2hex(random_bytes(32));

    $update = $pdo->prepare("
        UPDATE users
        SET api_token = :token
        WHERE id = :id
    ");
    $update->execute([
        ':token' => $token,
        ':id' => $user['id']
    ]);

    // ===============================
    // SUCESSO
    // ===============================
    echo json_encode([
        'success' => true,
        'message' => 'Login realizado com sucesso',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'nome' => $user['nome'],
            'email' => $user['email']
        ]
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro interno do servidor'
    ]);
}