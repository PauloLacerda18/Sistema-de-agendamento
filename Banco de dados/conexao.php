<?php
$host    = "185.245.180.1";
$usuario = "ogar4353_admin";
$senha   = "unifametro2025";
$banco   = "ogar4353_agendadeavisos";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Erro ao conectar: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>
