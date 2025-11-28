<?php
// Bancodedados/avisos_leitura.php
header('Content-Type: application/json; charset=utf-8');

require 'conexao.php';

$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;

if ($id <= 0) {
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'ID inválido.'
    ]);
    exit;
}

$sql = "UPDATE avisos
        SET lido = 1,
            data_leitura = NOW()
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Erro na preparação do SQL: ' . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['sucesso' => true]);
} else {
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Erro ao confirmar leitura: ' . $stmt->error
    ]);
}
