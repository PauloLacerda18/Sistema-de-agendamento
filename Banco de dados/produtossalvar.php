<?php
require 'conexao.php';

$id        = $_POST['id']        ?? null;
$nome      = $_POST['nome']      ?? '';
$categoria = $_POST['categoria'] ?? '';
$unidade   = $_POST['unidade']   ?? '';
$preco     = $_POST['preco']     ?? 0;
$estoque   = $_POST['estoque']   ?? 0;

// Garante tipos corretos
$preco   = (float) $preco;
$estoque = (int) $estoque;

if ($id) {
    // ATUALIZAR
    $sql  = "UPDATE produtos
             SET nome = ?, categoria = ?, unidade = ?, preco = ?, estoque = ?
             WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo "erro: " . $conn->error;
        exit;
    }
    // s = string, d = double (float), i = integer
    $stmt->bind_param("sssddi", $nome, $categoria, $unidade, $preco, $estoque, $id);
} else {
    // INSERIR
    $sql  = "INSERT INTO produtos (nome, categoria, unidade, preco, estoque)
             VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo "erro: " . $conn->error;
        exit;
    }
    $stmt->bind_param("sssdi", $nome, $categoria, $unidade, $preco, $estoque);
}

if ($stmt->execute()) {

    // ===== ALERTA AUTOMÁTICO DE ESTOQUE BAIXO (E-MAIL) =====
    if ($estoque <= 4) {
        $para      = "paulohenriquelacerdacruz123@gmail.com";      // <-- e-mail que vai receber o alerta
        $assunto   = "Estoque baixo: $nome";
        $mensagem  = "Atenção! O produto '$nome' está com estoque baixo ($estoque unidades).";
        $headers   = "From: paulo@agendadeavisos.paulolacerdaweb.com.br\r\n" .
                     "Reply-To: paulohenriquelacerdacruz123@gmail.com\r\n" .
                     "X-Mailer: PHP/" . phpversion();

        @mail($para, $assunto, $mensagem, $headers);
    }
    // =======================================================

    echo "ok"; // o JS espera exatamente isso
} else {
    echo "erro: " . $stmt->error;
}

$stmt->close();
