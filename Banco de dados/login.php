<?php
session_start();
require "conexao.php";

$cpf = preg_replace('/\D/', '', $_POST['cpf']); // remove máscara
$senhaDigitada = $_POST['senha'];

// BUSCA O USUÁRIO
$sql = "SELECT * FROM seguranca_tbUsuarios WHERE login = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $cpf);
$stmt->execute();
$result = $stmt->get_result();

// SE NÃO EXISTE
if ($result->num_rows === 0) {
    echo "<script>alert('Usuário não encontrado'); window.location='../index.html';</script>";
    exit;
}

$usuario = $result->fetch_assoc();

// VERIFICA SENHA
if (!password_verify($senhaDigitada, $usuario["senha"])) {
    echo "<script>alert('Senha incorreta'); window.location='../index.html';</script>";
    exit;
}

// LOGIN OK → SALVA SESSÃO
$_SESSION["usuario_id"] = $usuario["usuario_id"];
$_SESSION["nome"] = $usuario["nome"];

// REDIRECIONA PARA O SISTEMA
echo "<script>
    alert('Login realizado com sucesso!');
    window.location='../painel.html';
</script>";
?>
