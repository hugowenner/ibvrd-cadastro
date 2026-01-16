<?php
// backend/api/visitas_pastorais.php

require_once 'config.php'; // Inclui conexão e CORS

header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Validação de Token
 $headers = getallheaders();
 $authHeader = $headers['Authorization'] ?? '';
 $token = str_replace('Bearer ', '', $authHeader);

if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token não fornecido']);
    exit;
}

 $data = json_decode(file_get_contents("php://input"), true);

try {
    // --- GET: Listar Visitas (Ordenadas por Data, mais recente primeiro) ---
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // ✅ CORREÇÃO: Ajustado para usar ALIAS (AS) para o nomeCompleto funcionar no React
        $sql = "SELECT vp.*, p.nome_completo AS nomeCompleto 
                FROM visitas_pastorais vp 
                JOIN pessoas p ON vp.pessoa_id = p.id 
                ORDER BY vp.data_visita DESC, vp.created_at DESC";
        
        $stmt = $pdo->query($sql);
        $visitas = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $visitas]);
    }

    // --- POST: Criar Visita ---
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!isset($data['pessoa_id']) || !isset($data['data_visita']) || !isset($data['motivo'])) {
            throw new Exception("Campos obrigatórios faltando (pessoa_id, data_visita, motivo)");
        }

        $sql = "INSERT INTO visitas_pastorais (pessoa_id, data_visita, motivo, observacoes) 
                VALUES (:pid, :data, :motivo, :obs)";
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':pid' => $data['pessoa_id'],
            ':data' => $data['data_visita'], // Formato YYYY-MM-DD
            ':motivo' => $data['motivo'],
            ':obs' => $data['observacoes'] ?? ''
        ]);

        echo json_encode(['success' => true, 'message' => 'Visita registrada.']);
    }

    // --- DELETE: Excluir Visita ---
    elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = $_GET['id'];
        if (!$id) throw new Exception("ID não informado");

        $sql = "DELETE FROM visitas_pastorais WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        echo json_encode(['success' => true, 'message' => 'Visita removida.']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}