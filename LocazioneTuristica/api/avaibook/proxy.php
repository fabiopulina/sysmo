<?php
/**
 * Magenta Stay — AvaiBook Owner API proxy (Aruba PHP)
 *
 * NEVER put the API token in JavaScript. Only here (server-side).
 * Copy config.sample.php → config.php and fill AVAIBOOK_API_TOKEN.
 *
 * Allowed actions (GET only from browser):
 *   ?action=accommodations
 *   ?action=calendar&accommodation=ID&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 *   ?action=availability&accommodation=ID&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 *   ?action=price&accommodation=ID&checkinDate=YYYY-MM-DD&checkoutDate=YYYY-MM-DD&travelers=2
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'error' => 'config_missing',
        'message' => 'Copia api/avaibook/config.sample.php in config.php e inserisci il token AvaiBook.',
    ]);
    exit;
}

$config = require $configFile;
$token = isset($config['token']) ? trim((string) $config['token']) : '';
$base = rtrim((string) ($config['base_url'] ?? 'https://api.avaibook.biz'), '/');
$defaultAcc = isset($config['default_accommodation_id']) ? (string) $config['default_accommodation_id'] : '';

if ($token === '' || $token === 'PASTE_TOKEN_HERE') {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'token_missing']);
    exit;
}

$action = isset($_GET['action']) ? preg_replace('/[^a-z_]/', '', strtolower($_GET['action'])) : '';

function bad_request($msg) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'bad_request', 'message' => $msg]);
    exit;
}

function date_ok($v) {
    return is_string($v) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $v);
}

function avaibook_get($base, $token, $path, $query = []) {
    $url = $base . $path;
    if ($query) {
        $url .= (strpos($url, '?') === false ? '?' : '&') . http_build_query($query);
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
            'X-AUTH-TOKEN: ' . $token,
        ],
    ]);
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($body === false) {
        http_response_code(502);
        echo json_encode(['ok' => false, 'error' => 'curl', 'message' => $err]);
        exit;
    }
    http_response_code($code >= 100 ? $code : 502);
    $json = json_decode($body, true);
    if ($json === null && $body !== '' && $body !== 'null') {
        echo json_encode(['ok' => false, 'error' => 'upstream_non_json', 'status' => $code, 'raw' => substr($body, 0, 500)]);
        exit;
    }
    echo json_encode(['ok' => $code >= 200 && $code < 300, 'status' => $code, 'data' => $json], JSON_UNESCAPED_UNICODE);
    exit;
}

switch ($action) {
    case 'accommodations':
        avaibook_get($base, $token, '/api/owner/accommodations/');
        break;

    case 'calendar':
        $id = isset($_GET['accommodation']) ? preg_replace('/\D/', '', (string) $_GET['accommodation']) : $defaultAcc;
        if ($id === '') bad_request('accommodation id required');
        $q = [];
        if (!empty($_GET['startDate']) && date_ok($_GET['startDate'])) $q['startDate'] = $_GET['startDate'];
        if (!empty($_GET['endDate']) && date_ok($_GET['endDate'])) $q['endDate'] = $_GET['endDate'];
        avaibook_get($base, $token, '/api/owner/accommodations/' . $id . '/calendar/', $q);
        break;

    case 'availability':
        $id = isset($_GET['accommodation']) ? preg_replace('/\D/', '', (string) $_GET['accommodation']) : $defaultAcc;
        if ($id === '') bad_request('accommodation id required');
        if (empty($_GET['startDate']) || !date_ok($_GET['startDate'])) bad_request('startDate YYYY-MM-DD required');
        if (empty($_GET['endDate']) || !date_ok($_GET['endDate'])) bad_request('endDate YYYY-MM-DD required');
        avaibook_get($base, $token, '/api/owner/accommodations/' . $id . '/availability/', [
            'startDate' => $_GET['startDate'],
            'endDate' => $_GET['endDate'],
        ]);
        break;

    case 'price':
        $id = isset($_GET['accommodation']) ? preg_replace('/\D/', '', (string) $_GET['accommodation']) : $defaultAcc;
        if ($id === '') bad_request('accommodation id required');
        $q = [];
        if (!empty($_GET['checkinDate']) && date_ok($_GET['checkinDate'])) $q['checkinDate'] = $_GET['checkinDate'];
        if (!empty($_GET['checkoutDate']) && date_ok($_GET['checkoutDate'])) $q['checkoutDate'] = $_GET['checkoutDate'];
        if (isset($_GET['travelers']) && $_GET['travelers'] !== '') $q['travelers'] = (int) $_GET['travelers'];
        avaibook_get($base, $token, '/api/owner/accommodations/' . $id . '/booking-price/', $q);
        break;

    case 'ping':
        echo json_encode([
            'ok' => true,
            'env' => $config['env'] ?? 'unknown',
            'base_url' => $base,
            'default_accommodation_id' => $defaultAcc,
            'has_token' => true,
            'booking_engine_url' => isset($config['booking_engine_url'])
                ? trim((string) $config['booking_engine_url'])
                : '',
        ]);
        break;

    default:
        bad_request('action must be accommodations|calendar|availability|price|ping');
}
