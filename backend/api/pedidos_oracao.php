<?php
// backend/api/pedidos_oracao.php

// Inclui configuração e verificação de autenticação (igual auth.php)
require_once 'config.php'; // Certifique-se que config.php já tem os headers CORS e conexão

// Headers extras necessários
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Pegar o token do cabeçalho e validar (simplificado para o exemplo, melhor usar middleware)
 $headers = getallheaders();
 $authHeader = $headers['Authorization'] ?? '';
 $token = str_replace('Bearer ', '', $authHeader);

// Validação simples de token (opcional para teste, mas recomendado)
if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token não fornecido']);
    exit;
}

 $data = json_decode(file_get_contents("php://input"), true);

try {
    // --- GET: Listar Pedidos ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $sql = "SELECT po.*, p.nomeCompleto 
                FROM pedidos_oracao po 
                JOIN pessoas p ON po.pessoa_id = p.id 
                ORDER BY 
                FIELD(po.status, 'aberto') DESC,
                FIELD(po.urgencia, 'alta') DESC,
                po.created_at DESC";
        
        $stmt = $pdo->query($sql);
        $pedidos = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $pedidos]);
    }

    // --- POST: Criar Pedido ---
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!isset($data['pessoa_id']) || !isset($data['descricao'])) {
            throw new Exception("Campos obrigatórios faltando");
        }

        $sql = "INSERT INTO pedidos_oracao (pessoa_id, descricao, urgencia) VALUES (:pid, :desc, :urg)";
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':pid' => $data['pessoa_id'],
            ':desc' => $data['descricao'],
            ':urg' => $data['urgencia'] ?? 'media'
        ]);

        echo json_encode(['success' => true, 'message' => 'Pedido adicionado.']);
    }

    // --- PUT: Atualizar Status ---
    elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        if (!isset($data['id'])) throw new Exception("ID não informado");

        // Se não passar status, assume que é para 'orado'
        $status = $data['status'] ?? 'orado';
        
        $sql = "UPDATE pedidos_oracao SET status = :status WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':status' => $status, ':id' => $data['id']]);

        echo json_encode(['success' => true, 'message' => 'Status atualizado.']);
    }

    // --- DELETE: Remover Pedido ---
    elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = $_GET['id'];
        if (!$id) throw new Exception("ID não informado");

        $sql = "DELETE FROM pedidos_oracao WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        echo json_encode(['success' => true, 'message' => 'Pedido removido.']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}