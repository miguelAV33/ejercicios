<?php
function conectar_db()
{
    $host = "localhost";
    $db = "poligonos";
    $user = "root";
    $pass = ""; // en XAMPP por defecto está vacío

    $conn = new mysqli($host, $user, $pass, $db);

    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }
    return $conn;
}

function realizar_query($conn, $query, $args = [], $is_fetch = false)
{
    $stmt = $conn->prepare($query);

    if (!empty($args)) {
        $tipos = str_repeat("s", count($args));
        $stmt->bind_param($tipos, ...$args);
    }

    $stmt->execute();

    if ($is_fetch) {
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    return $stmt->affected_rows;
}
?>