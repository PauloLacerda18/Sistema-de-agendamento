<?php
// Bancodedados/listar_avisos.php
header('Content-Type: application/json; charset=utf-8');

require 'conexao.php';

$sql = "
    SELECT
        id,
        titulo,
        conteudo,
        prioridade,
        data_envio,
        grupo,
        cargo,
        unidade,
        status,
        lido,
        data_leitura,
        criado_em
    FROM avisos
    ORDER BY data_envio DESC, id DESC
";

$result = $conn->query($sql);

$avisos = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $avisos[] = $row;
    }
} else {
    echo json_encode([
        'erro' => $conn->error,
        'sucesso' => false
    ]);
    exit;
}

echo json_encode($avisos);
