<?php
// confirmar_leitura.php
header('Content-Type: application/json; charset=utf-8');

if (!isset($_POST['id'])) {
    echo json_encode(['sucesso' => false, 'erro' => 'ID não informado']);
    exit;
}

$id = (int) $_POST['id'];

require 'conexao.php';

$sql = "UPDATE avisos_estoque SET lido = 1, data_leitura = NOW() WHERE id = ?";
$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    echo json_encode(['sucesso' => false, 'erro' => $mysqli->error]);
    exit;
}

$stmt->bind_param("i", $id);
$ok = $stmt->execute();

if ($ok) {
    echo json_encode(['sucesso' => true, 'data_leitura' => date('Y-m-d H:i:s')]);
} else {
    echo json_encode(['sucesso' => false, 'erro' => $stmt->error]);
}
