<?php
// includes/auth.php — Sesión, roles y utilidades
if (session_status() === PHP_SESSION_NONE) session_start();

function isLoggedIn(): bool {
    return !empty($_SESSION['usuario_id']);
}

function isAdmin(): bool {
    return isLoggedIn() && $_SESSION['rol'] === 'admin';
}

function requireLogin(): void {
    if (!isLoggedIn()) {
        header('Location: /login.php');
        exit;
    }
}

function requireAdmin(): void {
    requireLogin();
    if (!isAdmin()) {
        header('Location: /cliente/perfil.php');
        exit;
    }
}

/**
 * Calcula la edad actual a partir de la fecha de nacimiento.
 * Se guarda también en cada viaje para conservar el dato histórico.
 */
function calcularEdad(string $fechaNac): int {
    return (int)(new DateTime())->diff(new DateTime($fechaNac))->y;
}

/** Escapa HTML para evitar XSS */
function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
