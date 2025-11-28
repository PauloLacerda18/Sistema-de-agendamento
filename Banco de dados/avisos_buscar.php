<?php
// Bancodedados/avisos_buscar.php
header('Content-Type: application/json; charset=utf-8');

require 'conexao.php';

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($id <= 0) {
    echo json_encode(['sucesso' => false, 'erro' => 'ID inválido']);
    exit;
}

$sql = "SELECT id, titulo, conteudo, prioridade, data_envio, grupo, cargo, unidade, status
        FROM avisos
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['sucesso' => false, 'erro' => $conn->error]);
    exit;
}

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$aviso = $result->fetch_assoc();

if (!$aviso) {
    echo json_encode(['sucesso' => false, 'erro' => 'Aviso não encontrado']);
    exit;
}

// separa data e hora para preencher o formulário
$dataHora = $aviso['data_envio']; // yyyy-mm-dd hh:ii:ss
$dia = substr($dataHora, 0, 10);
$hora = substr($dataHora, 11, 5);

$aviso['data_envio_dia'] = $dia;
$aviso['data_envio_hora'] = $hora;

echo json_encode(['sucesso' => true, 'aviso' => $aviso]);
