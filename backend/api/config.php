<?php
// backend/api/config.php

// 1. Exibir erros (Importante para vermos se a conexão falha)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ===============================
// CONFIGURAÇÃO DE CORS
// ===============================
function sendCorsHeaders() {
    $allowed_origins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://cadastro.ibvrd.com.br',
        'https://www.cadastro.ibvrd.com.br'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($origin && in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }
}

// Responde imediatamente para requisições OPTIONS (Preflight)
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
// SELEÇÃO DE AMBIENTE
// ===============================
// Detecta automaticamente se está rodando no localhost ou no servidor
 $hostCheck = $_SERVER['HTTP_HOST'] ?? '';
 $appEnv = (strpos($hostCheck, 'localhost') !== false || strpos($hostCheck, '127.0.0.1') !== false) ? 'local' : 'production';

// ===============================
// CONEXÃO COM BANCO DE DADOS
// ===============================
try {

    if ($appEnv === 'local') {

        // ===============================
        // SQLITE (LOCAL / DESENVOLVIMENTO)
        // ===============================
        $dbPath = __DIR__ . '/../database/ibvrd.sqlite';

        if (!file_exists($dbPath)) {
            throw new Exception("Arquivo SQLite não encontrado em: $dbPath");
        }

        $pdo = new PDO("sqlite:$dbPath");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    } else {

        // ===============================
        // MYSQL (PRODUÇÃO - HOSTGATOR)
        // ===============================
        // DADOS INSERIDOS BASEADO NO QUE VOCÊ ENVIU
        
        $host = "localhost";
        $dbname = "thia7642_pessoas_db";
        $user = "thia7642_hugowenner"; // Espaço removido manualmente aqui
        $pass = "@Geforce9600gt";

        $pdo = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $user,
            $pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
    }

    // Configurações gerais do PDO
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (Throwable $e) {
    // Garante que ERROS de conexão voltem como JSON e não HTML
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro de conexão com o banco de dados',
        'details' => $e->getMessage()
    ]);
    exit;
}