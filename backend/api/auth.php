<?php
// backend/api/auth.php

require_once 'config.php';

// Apenas método POST é permitido para login
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

 $input = json_decode(file_get_contents('php://input'), true);

if (empty($input['email']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email e senha são obrigatórios']);
    exit;
}

 $email = $input['email'];
 $password = $input['password'];

try {
    // 1. Buscar usuário pelo email
    // Assumindo que a tabela 'users' existe
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch();

    // 2. Verificar se existe e se a senha bate
    if ($user && password_verify($password, $user['password'])) {
        
        // 3. Gerar Token Simples (apenas se não tiver um válido ou para renovar)
        // Aqui vamos gerar um novo token a cada login por segurança
        $newToken = bin2hex(random_bytes(32));
        
        $updateStmt = $pdo->prepare("UPDATE users SET api_token = :token WHERE id = :id");
        $updateStmt->execute([
            ':token' => $newToken,
            ':id' => $user['id']
        ]);

        // 4. Retornar sucesso e dados básicos (sem senha!)
        echo json_encode([
            'success' => true,
            'message' => 'Login realizado com sucesso',
            'token' => $newToken,
            'user' => [
                'id' => $user['id'],
                'nome' => $user['nome'],
                'email' => $user['email']
            ]
        ]);

    } else {
        // Senha incorreta ou usuário não encontrado
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Credenciais inválidas']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no servidor', 'details' => $e->getMessage()]);
}