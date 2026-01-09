<?php
// backend/api/config.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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
        'details' => $appEnv === 'local'
            ? $e->getMessage()
            : 'Erro interno'
    ]);
    exit;
}
