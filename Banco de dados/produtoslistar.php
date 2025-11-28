<?php
require 'conexao.php';

$dados = [];

$sql = "SELECT * FROM produtos ORDER BY id DESC";
$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $dados[] = $row;
    }
} else {
    // Se der erro, devolve texto simples (vai aparecer no console do navegador)
    header('Content-Type: text/plain; charset=utf-8');
    echo "erro: " . $conn->error;
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($dados);
