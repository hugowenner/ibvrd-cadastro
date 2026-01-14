<?php
// backend/api/config.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===============================
// CONFIGURAÇÃO DE CORS GLOBAL
// ===============================

function sendCorsHeaders() {
    $allowed_origins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://cadastro.ibvrd.com.br'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($origin && in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }
}

// ===============================
// PREFLIGHT (OPTIONS) — TEM QUE SER PRIMEIRO
// ===============================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendCorsHeaders();
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit;
}

// Headers normais
sendCorsHeaders();
header("Content-Type: application/json; charset=UTF-8");

// ===============================
// AMBIENTE — FORÇADO LOCAL (DEBUG)
// ===============================
// ⚠️ IMPORTANTE:
// Enquanto estiver usando `php -S localhost:8000`
// vamos FORÇAR SQLite para não dar erro.
$appEnv = 'local';

// ===============================
// CONEXÃO COM BANCO DE DADOS
// ===============================
try {

    if ($appEnv === 'local') {

        // ===============================
        // SQLITE (LOCAL)
        // ===============================
        $dbPath = __DIR__ . '/../database/ibvrd.sqlite';

        if (!file_exists($dbPath)) {
            throw new Exception("Arquivo SQLite não encontrado em: $dbPath");
        }

        $pdo = new PDO("sqlite:$dbPath");

    } else {

        // ===============================
        // MYSQL (PRODUÇÃO) — USAR DEPOIS
        // ===============================
        $envFile = __DIR__ . '/../.env';

        if (!file_exists($envFile)) {
            throw new Exception("Arquivo .env não encontrado");
        }

        $env = parse_ini_file($envFile);

        $pdo = new PDO(
            "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4",
            $env['DB_USER'],
            $env['DB_PASS']
        );
    }

    // Configurações do PDO
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro de conexão com o banco',
        'details' => $e->getMessage() // DEBUG LOCAL
    ]);
    exit;
}
