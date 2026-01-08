<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../config/database.php";

$pessoas = $pdo->query("
    SELECT *
    FROM pessoas
    ORDER BY data_cadastro DESC
")->fetchAll();

echo json_encode($pessoas);
