<?php
// backend/api/users.php

require_once 'config.php';

// 1. Verificar Método
 $method = $_SERVER['REQUEST_METHOD'];
 $input = json_decode(file_get_contents('php://input'), true);

// 2. Verificar Autenticação (Middleware Simples)
 $headers = getallheaders();
 $authHeader = $headers['Authorization'] ?? '';

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token de autorização não enviado.']);
    exit;
}

// Extrair o token (formato esperado: "Bearer <token>")
 $token = str_replace('Bearer ', '', $authHeader);

try {
    // Busca usuário pelo token para validar sessão
    $stmt = $pdo->prepare("SELECT id FROM users WHERE api_token = :token LIMIT 1");
    $stmt->execute([':token' => $token]);
    $currentUser = $stmt->fetch();

    if (!$currentUser) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token inválido ou sessão expirada.']);
        exit;
    }

    // 3. Lógica baseada no Método
    switch ($method) {
        case 'GET':
            // Listar usuários
            $stmt = $pdo->query("SELECT id, nome, email, created_at FROM users ORDER BY id DESC");
            $response = $stmt->fetchAll();
            break;

        case 'POST':
            // Criar novo usuário
            $nome = $input['nome'] ?? '';
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';

            // Validação básica
            if (empty($nome) || empty($email) || empty($password)) {
                throw new Exception('Nome, email e senha são obrigatórios.');
            }

            // Verificar se email já existe
            $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $checkStmt->execute([$email]);
            if ($checkStmt->fetch()) {
                throw new Exception('Este email já está cadastrado.');
            }

            // Hash da senha
            $senhaHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Gerar token para o novo usuário
            $newToken = bin2hex(random_bytes(32));

            // Inserir
            $insertStmt = $pdo->prepare("INSERT INTO users (nome, email, password, api_token) VALUES (?, ?, ?, ?)");
            if ($insertStmt->execute([$nome, $email, $senhaHash, $newToken])) {
                $id = $pdo->lastInsertId();
                
                // Retornar dados do usuário criado (sem senha)
                $response = [
                    'success' => true,
                    'message' => 'Usuário criado com sucesso',
                    'user' => [
                        'id' => $id,
                        'nome' => $nome,
                        'email' => $email
                    ]
                ];
                http_response_code(201);
            } else {
                throw new Exception('Erro ao salvar usuário.');
            }
            break;

        default:
            http_response_code(405);
            $response = ['error' => 'Método não permitido'];
    }

} catch (Exception $e) {
    http_response_code(500);
    $response = ['success' => false, 'error' => $e->getMessage()];
}

echo json_encode($response);