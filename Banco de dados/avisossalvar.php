<?php

header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'conexao.php';   

// Dados do formulário
$titulo     = $_POST['titulo']     ?? '';
$conteudo   = $_POST['conteudo']   ?? '';
$prioridade = $_POST['prioridade'] ?? '';
$status     = $_POST['status']     ?? 'publicado';

$data_envio = $_POST['data_envio'] ?? '';
$hora_envio = $_POST['hora_envio'] ?? '';

$grupo   = $_POST['grupo']   ?? '';
$cargo   = $_POST['cargo']   ?? '';
$unidade = $_POST['unidade'] ?? '';

// validação básica
if (empty($titulo) || empty($conteudo) || empty($prioridade) ||
    empty($data_envio) || empty($hora_envio)) {

    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Campos obrigatórios não preenchidos.'
    ]);
    exit;
}

// monta DATETIME: yyyy-mm-dd hh:mm:ss
$data_envio_dt = $data_envio . ' ' . $hora_envio . ':00';


if (!isset($conn) || !($conn instanceof mysqli)) {
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Conexão com o banco não encontrada (verifique conexao.php).'
    ]);
    exit;
}

$sql = "
    INSERT INTO avisos
        (titulo, conteudo, prioridade, data_envio, grupo, cargo, unidade, status)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Erro na preparação do SQL: ' . $conn->error
    ]);
    exit;
}

$stmt->bind_param(
    "ssssssss",
    $titulo,
    $conteudo,
    $prioridade,
    $data_envio_dt,
    $grupo,
    $cargo,
    $unidade,
    $status
);

if ($stmt->execute()) {
    echo json_encode(['sucesso' => true]);
} else {
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Erro ao executar INSERT: ' . $stmt->error
    ]);
}
