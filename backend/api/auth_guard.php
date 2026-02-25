<?php
// backend/api/auth_guard.php

function getAuthHeader(): string {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!$authHeader && function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
    }

    return $authHeader ?: '';
}

function requireAuth(PDO $pdo): array {
    $authHeader = getAuthHeader();

    if (!$authHeader) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Token de autorização não enviado.'
        ]);
        exit;
    }

    $token = trim(str_replace('Bearer', '', $authHeader));
    if (!$token) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Token inválido.'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, role FROM users WHERE api_token = :t LIMIT 1");
    $stmt->execute([':t' => $token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Token inválido ou expirado.'
        ]);
        exit;
    }

    return $user;
}

function requireAdmin(array $user): void {
    if (($user['role'] ?? '') !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Acesso negado. Apenas admins podem executar esta ação.'
        ]);
        exit;
    }
}