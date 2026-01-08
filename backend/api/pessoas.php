<?php
// backend/api/pessoas.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($method) {

        // =========================
        // GET
        // =========================
        case 'GET':
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM pessoas WHERE id = :id");
                $stmt->bindParam(':id', $id);
                $stmt->execute();
                $response = $stmt->fetch() ?: ["error" => "Não encontrado"];
            } else {
                $stmt = $pdo->query("SELECT * FROM pessoas ORDER BY id DESC");
                $response = $stmt->fetchAll();
            }
            break;

        // =========================
        // POST (PADRONIZADO)
        // =========================
        case 'POST':
            if (empty($input['nomeCompleto'])) {
                throw new Exception("Nome obrigatório");
            }

            $sql = "INSERT INTO pessoas (
                nome_completo,
                data_nascimento,
                telefone,
                email,
                endereco,
                tipo,
                ministerio,
                observacoes
            ) VALUES (
                :nome,
                :nasc,
                :tel,
                :email,
                :end,
                :tipo,
                :min,
                :obs
            )";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':nome' => $input['nomeCompleto'],
                ':nasc' => $input['dataNascimento'],
                ':tel'  => $input['telefone'],
                ':email'=> $input['email'],
                ':end'  => $input['endereco'],
                ':tipo' => $input['tipo'] ?? 'Visitante',
                ':min'  => $input['ministerio'] ?? 'Nenhum',
                ':obs'  => $input['observacoes'] ?? null
            ]);

            // 🔑 ID inserido
            $id = $pdo->lastInsertId();

            // 🔁 Retorna o registro no MESMO formato do GET
            $stmt = $pdo->prepare("SELECT * FROM pessoas WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            http_response_code(201);
            $response = $stmt->fetch();
            break;

        // =========================
        // PUT / PATCH
        // =========================
        case 'PUT':
        case 'PATCH':
            if (!$id) {
                throw new Exception("ID necessário");
            }

            $sql = "UPDATE pessoas SET 
                nome_completo = :nome,
                data_nascimento = :nasc,
                telefone = :tel,
                email = :email,
                endereco = :end,
                tipo = :tipo,
                ministerio = :min,
                observacoes = :obs
            WHERE id = :id";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id'   => $id,
                ':nome' => $input['nomeCompleto'],
                ':nasc' => $input['dataNascimento'],
                ':tel'  => $input['telefone'],
                ':email'=> $input['email'],
                ':end'  => $input['endereco'],
                ':tipo' => $input['tipo'] ?? 'Visitante',
                ':min'  => $input['ministerio'] ?? 'Nenhum',
                ':obs'  => $input['observacoes'] ?? null
            ]);

            // retorna o registro atualizado
            $stmt = $pdo->prepare("SELECT * FROM pessoas WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $response = $stmt->fetch();
            break;

        // =========================
        // DELETE
        // =========================
        case 'DELETE':
            if (!$id) {
                throw new Exception("ID necessário");
            }

            $stmt = $pdo->prepare("DELETE FROM pessoas WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $response = ["success" => true];
            break;

        default:
            http_response_code(405);
            $response = ["error" => "Método não permitido"];
    }

} catch (Exception $e) {
    http_response_code(500);
    $response = ["error" => $e->getMessage()];
}

echo json_encode($response);
