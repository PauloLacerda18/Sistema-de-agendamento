<?php
// Bancodedados/avisos_status.php
header('Content-Type: application/json; charset=utf-8');

require 'conexao.php';

$id     = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$status = $_POST['status'] ?? '';

$permitidos = ['publicado', 'rascunho', 'suspenso', 'cancelado'];

if ($id <= 0 || !in_array($status, $permitidos, true)) {
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Dados inválidos.'
    ]);
    exit;
}

$sql = "UPDATE avisos SET status = ? WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Erro na preparação do SQL: ' . $conn->error
    ]);
    exit;
}

$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(['sucesso' => true]);
} else {
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Erro ao atualizar status: ' . $stmt->error
    ]);
}
