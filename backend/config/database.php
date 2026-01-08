<?php
$host = "localhost";
$dbname = "thia7642_pessoas_db";
$user = "thia7642_hugowenner";
$pass = "@Geforce9600gt"; // ⚠️ coloque a senha real

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Erro de conexão com o banco",
        "details" => $e->getMessage()
    ]);
    exit;
}
