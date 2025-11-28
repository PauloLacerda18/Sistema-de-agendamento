<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

require 'conexao.php';

// Dados da PESSOA
$nome       = $_POST['nome']       ?? '';
$cpf        = $_POST['cpf']        ?? '';
$nascimento = $_POST['nascimento'] ?? '';
$telefone   = $_POST['telefone']   ?? '';

// Dados de LOGIN
$login = preg_replace('/\D/','',$cpf);   // login = cpf sem máscara
$senha = $_POST['senha'] ?? '';
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

try {
    $conn->begin_transaction();

    // 1) Inserir pessoa
    $sqlPessoa = "INSERT INTO cadastro_tbPessoas (nome, cpf, nascimento, telefone)
                  VALUES (?, ?, ?, ?)";
    $stmtPessoa = $conn->prepare($sqlPessoa);
    $stmtPessoa->bind_param("ssss", $nome, $cpf, $nascimento, $telefone);
    $stmtPessoa->execute();

    $pessoaId = $conn->insert_id;

    // 2) Inserir usuário
    $sqlUsuario = "INSERT INTO seguranca_tbUsuarios 
                   (usuario_id, nome, login, senha) 
                   VALUES (?, ?, ?, ?)";
    $stmtUsuario = $conn->prepare($sqlUsuario);
    $stmtUsuario->bind_param(
        "isss",
        $pessoaId,
        $nome,
        $login,
        $senhaHash
    );
    $stmtUsuario->execute();

    $conn->commit();

    echo "<script>alert('Cadastro realizado com sucesso!');
          window.location.href='../index.html';</script>";

} catch (mysqli_sql_exception $e) {
    $conn->rollback();
    echo "Erro ao cadastrar: " . $e->getMessage();
}
