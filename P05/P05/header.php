<?php
session_start();

// Comprobar si está logado
if (!isset($_SESSION["user_ok"])) {
    header("Location: login.php");
    exit;
}

// Tiempo de expiración: 10 minutos
$minutos_expiracion = 10;

if (isset($_SESSION["tiempo_ultimo_submit"])) {
    $segundos_inactivo = time() - $_SESSION["tiempo_ultimo_submit"];

    if ($segundos_inactivo >= $minutos_expiracion * 60) {
        session_unset();
        session_destroy();
        header("Location: login.php?expired=1");
        exit;
    }
}

// Actualizamos el tiempo en cada visita
$_SESSION["tiempo_ultimo_submit"] = time();
?>
