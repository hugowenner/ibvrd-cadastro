<?php
// backend/api/pedidos_oracao.php

require_once 'config.php';

// Headers (igual padrão dos outros endpoints)
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents('php://input'), true);

/*
|--------------------------------------------------------------------------
| AUTH (mesmo padrão, compatível com Windows)
|--------------------------------------------------------------------------
*/
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

if (!$authHeader && function_exists('getallheaders')) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
}

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token de autorização não enviado.']);
    exit;
}

$token = str_replace('Bearer ', '', $authHeader);

try {
    // Valida token
    $stmt = $pdo->prepare("SELECT id FROM users WHERE api_token = :token LIMIT 1");
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Token inválido ou expirado.']);
        exit;
    }

    switch ($method) {

        /* =========================
           GET
        ========================== */
        case 'GET':

            $sql = "
                SELECT
                    po.*,
                    p.nome_completo
                FROM pedidos_oracao po
                JOIN pessoas p ON po.pessoa_id = p.id
                ORDER BY
                    CASE po.status
                        WHEN 'aberto' THEN 3
                        WHEN 'orado' THEN 2
                        WHEN 'respondido' THEN 1
                        ELSE 0
                    END DESC,
                    CASE po.urgencia
                        WHEN 'alta' THEN 3
                        WHEN 'media' THEN 2
                        WHEN 'baixa' THEN 1
                        ELSE 0
                    END DESC,
                    po.created_at DESC
            ";

            $stmt = $pdo->query($sql);
            $response = [
                'success' => true,
                'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
            break;

        /* =========================
           POST
        ========================== */
        case 'POST':

            if (empty($input['pessoa_id']) || empty($input['descricao'])) {
                throw new Exception('Campos obrigatórios faltando');
            }

            $stmt = $pdo->prepare("
                INSERT INTO pedidos_oracao (pessoa_id, descricao, urgencia)
                VALUES (:pid, :desc, :urg)
            ");

            $stmt->execute([
                ':pid'  => $input['pessoa_id'],
                ':desc' => $input['descricao'],
                ':urg'  => $input['urgencia'] ?? 'media'
            ]);

            http_response_code(201);
            $response = ['success' => true];
            break;

        /* =========================
           PUT
        ========================== */
        case 'PUT':

            if (empty($input['id'])) {
                throw new Exception('ID não informado');
            }

            $stmt = $pdo->prepare("
                UPDATE pedidos_oracao
                SET status = :status
                WHERE id = :id
            ");

            $stmt->execute([
                ':status' => $input['status'] ?? 'orado',
                ':id'     => $input['id']
            ]);

            $response = ['success' => true];
            break;

        /* =========================
           DELETE
        ========================== */
        case 'DELETE':

            $id = $_GET['id'] ?? null;

            if (!$id) {
                throw new Exception('ID não informado');
            }

            $stmt = $pdo->prepare("DELETE FROM pedidos_oracao WHERE id = :id");
            $stmt->execute([':id' => $id]);

            $response = ['success' => true];
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
