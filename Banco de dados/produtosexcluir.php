<?php
require 'conexao.php';

$id = $_POST['id'] ?? null;

if (!$id) {
    echo "erro: id vazio";
    exit;
}

$id  = (int) $id;
$sql = "DELETE FROM produtos WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo "erro: " . $conn->error;
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo "ok";
} else {
    echo "erro: " . $stmt->error;
}

$stmt->close();
