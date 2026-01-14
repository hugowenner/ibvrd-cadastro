<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
error_reporting(E_ALL);

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

// ===============================
// APENAS POST
// ===============================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Método não permitido',
        'debug' => [
            'method' => $_SERVER['REQUEST_METHOD']
        ]
    ]);
    exit;
}

// ===============================
// INPUT JSON
// ===============================
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'JSON inválido',
        'debug' => [
            'raw' => $rawInput
        ]
    ]);
    exit;
}

if (
    !is_array($input) ||
    empty($input['email']) ||
    empty($input['password'])
) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Email e senha são obrigatórios',
        'debug' => $input
    ]);
    exit;
}

$email = trim($input['email']);
$password = $input['password'];

try {
    // ===============================
    // BUSCA USUÁRIO
    // ===============================
    $stmt = $pdo->prepare("
        SELECT id, nome, email, password
        FROM users
        WHERE email = :email
        LIMIT 1
    ");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Usuário não encontrado',
            'debug' => [
                'email' => $email
            ]
        ]);
        exit;
    }

    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Senha inválida'
        ]);
        exit;
    }

    // ===============================
    // TOKEN
    // ===============================
    $token = bin2hex(random_bytes(32));

    $update = $pdo->prepare("
        UPDATE users
        SET api_token = :token
        WHERE id = :id
    ");
    $update->execute([
        'token' => $token,
        'id' => $user['id']
    ]);

    echo json_encode([
        'success' => true,
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
        'error' => 'Erro interno',
        'debug' => [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}
