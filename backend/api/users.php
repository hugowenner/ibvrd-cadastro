<?php
// backend/api/users.php
require_once 'config.php';
require_once 'auth_guard.php';

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// AUTH
$currentUser = requireAuth($pdo);

// Apenas admin para escrita (POST/PUT/DELETE)
if ($method !== 'GET') {
    requireAdmin($currentUser);
}

try {
    switch ($method) {

        /* =========================
           GET (Listar Todos)
        ========================== */
        case 'GET':
            $stmt = $pdo->query("SELECT id, nome, email, role, status, created_at FROM users ORDER BY id DESC");
            $users = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $users]);
            break;

        /* =========================
           POST (Criar)
        ========================== */
        case 'POST':
            $nome = $input['nome'] ?? '';
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            $role = $input['role'] ?? 'lider';

            if (empty($nome) || empty($email) || empty($password)) {
                throw new Exception('Dados incompletos.');
            }

            $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $check->execute([$email]);
            if ($check->fetch()) throw new Exception('Email já cadastrado.');

            $hash = password_hash($password, PASSWORD_DEFAULT);
            $newToken = bin2hex(random_bytes(32));

            $sql = "INSERT INTO users (nome, email, password, api_token, role, status) VALUES (?, ?, ?, ?, ?, 'ativo')";
            $stmt = $pdo->prepare($sql);

            if ($stmt->execute([$nome, $email, $hash, $newToken, $role])) {
                echo json_encode(['success' => true, 'message' => 'Usuário criado.']);
            } else {
                throw new Exception('Erro ao criar.');
            }
            break;

        /* =========================
           PUT (Atualizar Role/Status)
        ========================== */
        case 'PUT':
            $id = $_GET['id'] ?? null;
            if (!$id) throw new Exception('ID necessário.');

            $fields = [];
            $params = [];

            if (!empty($input['role'])) {
                $fields[] = "role = ?";
                $params[] = $input['role'];
            }
            if (!empty($input['status'])) {
                $fields[] = "status = ?";
                $params[] = $input['status'];
            }

            if (empty($fields)) throw new Exception('Nada para atualizar.');

            $params[] = $id;
            $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['success' => true]);
            break;

        /* =========================
           DELETE (Excluir) - SÓ ADMIN
        ========================== */
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) throw new Exception('ID necessário.');

            // Impede auto-exclusão
            if ($id == $currentUser['id']) {
                throw new Exception('Você não pode excluir a si mesmo.');
            }

            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}