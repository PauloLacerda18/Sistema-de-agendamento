<?php
// Bancodedados/logout.php
session_start();

// limpa todas as variáveis de sessão
session_unset();

// destrói a sessão
session_destroy();

// volta para a tela de login/index na RAIZ do site
header("Location: ../index.html");
exit;
