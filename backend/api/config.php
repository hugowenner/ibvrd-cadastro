<?php
// backend/api/config.php

// ===============================
// CONFIGURAÇÃO DE CORS GLOBAL
// ===============================

// Lista de origens permitidas (Adicione outras se necessário)
 $allowed_origins = [
    'http://localhost:3000',
    'https://cadastro.ibvrd.com.br'
];

// Pega a origem da requisição
 $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Verifica se a origem está permitida
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true"); // Necessário se você usar cookies/sessões no futuro
}

// Headers padrões de CORS
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Tratamento de requisição OPTIONS (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ===============================
// CONEXÃO COM BANCO DE DADOS
// ===============================
 $envFile = __DIR__ . '/../.env';
 $env = parse_ini_file($envFile);

 $appEnv = $env['APP_ENV'] ?? 'local';

try {
    if ($appEnv === 'local') {
        // SQLITE
        $dbPath = __DIR__ . '/../database/ibvrd.sqlite';
        $pdo = new PDO("sqlite:$dbPath");
    } else {
        // MYSQL (produção)
        $pdo = new PDO(
            "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4",
            $env['DB_USER'],
            $env['DB_PASS']
        );
    }

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro de conexão com o banco',
        'details' => $appEnv === 'local' ? $e->getMessage() : 'Erro interno'
    ]);
    exit;
}