<?php
/**
 * Magenta Stay — AvaiBook Owner API proxy (Aruba PHP)
 *
 * NEVER put the API token in JavaScript. Only here (server-side).
 *
 * GET  ?action=ping|accommodations|calendar|availability|price
 * POST ?action=book  JSON: checkin, checkout, guests, name, email, phone, note
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

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
$base = rtrim((string) ($config['base_url'] ?? 'https://api.avaibook.com'), '/');
$defaultAcc = isset($config['default_accommodation_id']) ? (string) $config['default_accommodation_id'] : '';

if ($token === '' || $token === 'PASTE_TOKEN_HERE') {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'token_missing']);
    exit;
}

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
$action = isset($_GET['action']) ? preg_replace('/[^a-z_]/', '', strtolower((string) $_GET['action'])) : '';

function json_out($code, $payload) {
    http_response_code((int) $code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function bad_request($msg) {
    json_out(400, ['ok' => false, 'error' => 'bad_request', 'message' => $msg]);
}

function date_ok($v) {
    return is_string($v) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $v);
}

function avaibook_request($base, $token, $httpMethod, $path, $query = [], $jsonBody = null) {
    $url = $base . $path;
    if ($query) {
        $url .= '?' . http_build_query($query);
    }
    $ch = curl_init($url);
    $headers = [
        'Accept: application/json',
        'X-AUTH-TOKEN: ' . $token,
    ];
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_CUSTOMREQUEST => $httpMethod,
    ];
    if ($jsonBody !== null) {
        $payload = json_encode($jsonBody, JSON_UNESCAPED_UNICODE);
        $headers[] = 'Content-Type: application/json';
        $opts[CURLOPT_POSTFIELDS] = $payload;
    } else {
        $headers[] = 'Content-Type: application/json';
    }
    $opts[CURLOPT_HTTPHEADER] = $headers;
    curl_setopt_array($ch, $opts);
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($body === false) {
        return ['ok' => false, 'code' => 502, 'error' => 'curl', 'message' => $err, 'json' => null];
    }
    $json = json_decode($body, true);
    $ok = $code >= 200 && $code < 300;
    return [
        'ok' => $ok,
        'code' => $code >= 100 ? $code : 502,
        'json' => $json,
        'raw' => $body,
        'error' => $ok ? null : 'upstream',
    ];
}

function echo_upstream($res) {
    if (!empty($res['error']) && $res['error'] === 'curl') {
        json_out(502, ['ok' => false, 'error' => 'curl', 'message' => $res['message'] ?? '']);
    }
    $json = $res['json'];
    if ($json === null && isset($res['raw']) && $res['raw'] !== '' && $res['raw'] !== 'null' && $res['code'] !== 204) {
        json_out($res['code'], [
            'ok' => false,
            'error' => 'upstream_non_json',
            'status' => $res['code'],
            'raw' => substr((string) $res['raw'], 0, 500),
        ]);
    }
    json_out($res['code'], [
        'ok' => !empty($res['ok']),
        'status' => $res['code'],
        'data' => $json,
    ]);
}

function acc_id($defaultAcc) {
    $id = isset($_GET['accommodation']) ? preg_replace('/\D/', '', (string) $_GET['accommodation']) : $defaultAcc;
    if ($id === '') {
        bad_request('accommodation id required');
    }
    return $id;
}

function client_ip() {
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    return preg_replace('/[^0-9a-fA-F:.]/', '', $ip) ?: '0.0.0.0';
}

function rate_limit_ok($slot, $max, $windowSec) {
    $dir = __DIR__ . '/_rate';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $file = $dir . '/' . hash('sha256', $slot) . '.json';
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $prev = json_decode((string) file_get_contents($file), true);
        if (is_array($prev)) {
            $hits = $prev;
        }
    }
    $hits = array_values(array_filter($hits, function ($t) use ($now, $windowSec) {
        return is_int($t) && ($now - $t) < $windowSec;
    }));
    if (count($hits) >= $max) {
        return false;
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
    return true;
}

function lang_to_avaibook($code) {
    $map = [
        'it' => 'Italian',
        'en' => 'English',
        'de' => 'German',
        'fr' => 'French',
        'es' => 'Spanish',
        'pt' => 'Portuguese',
        'nl' => 'Dutch',
        'ca' => 'Catalan',
        'ru' => 'Russian',
    ];
    $code = strtolower(substr((string) $code, 0, 2));
    return $map[$code] ?? 'Italian';
}

function first_unit_id($list, $accId) {
    if (!is_array($list)) {
        return 0;
    }
    foreach ($list as $acc) {
        if (!is_array($acc)) {
            continue;
        }
        if ((string) ($acc['id'] ?? '') !== (string) $accId) {
            continue;
        }
        if (!empty($acc['units'][0]['id'])) {
            return (int) $acc['units'][0]['id'];
        }
    }
    if (count($list) === 1 && !empty($list[0]['units'][0]['id'])) {
        return (int) $list[0]['units'][0]['id'];
    }
    return 0;
}

switch ($action) {
    case 'accommodations':
        echo_upstream(avaibook_request($base, $token, 'GET', '/api/owner/accommodations/'));
        break;

    case 'calendar':
        $id = acc_id($defaultAcc);
        $q = [];
        if (!empty($_GET['startDate']) && date_ok($_GET['startDate'])) {
            $q['startDate'] = $_GET['startDate'];
        }
        if (!empty($_GET['endDate']) && date_ok($_GET['endDate'])) {
            $q['endDate'] = $_GET['endDate'];
        }
        echo_upstream(avaibook_request($base, $token, 'GET', '/api/owner/accommodations/' . $id . '/calendar/', $q));
        break;

    case 'availability':
        $id = acc_id($defaultAcc);
        if (empty($_GET['startDate']) || !date_ok($_GET['startDate'])) {
            bad_request('startDate YYYY-MM-DD required');
        }
        if (empty($_GET['endDate']) || !date_ok($_GET['endDate'])) {
            bad_request('endDate YYYY-MM-DD required');
        }
        echo_upstream(avaibook_request($base, $token, 'GET', '/api/owner/accommodations/' . $id . '/availability/', [
            'startDate' => $_GET['startDate'],
            'endDate' => $_GET['endDate'],
        ]));
        break;

    case 'price':
        $id = acc_id($defaultAcc);
        $q = [];
        if (!empty($_GET['checkinDate']) && date_ok($_GET['checkinDate'])) {
            $q['checkinDate'] = $_GET['checkinDate'];
        }
        if (!empty($_GET['checkoutDate']) && date_ok($_GET['checkoutDate'])) {
            $q['checkoutDate'] = $_GET['checkoutDate'];
        }
        if (isset($_GET['travelers']) && $_GET['travelers'] !== '') {
            $q['travelers'] = (int) $_GET['travelers'];
        }
        echo_upstream(avaibook_request($base, $token, 'GET', '/api/owner/accommodations/' . $id . '/booking-price/', $q));
        break;

    case 'ping':
        json_out(200, [
            'ok' => true,
            'env' => $config['env'] ?? 'unknown',
            'base_url' => $base,
            'default_accommodation_id' => $defaultAcc,
            'has_token' => true,
            'allow_direct_booking' => array_key_exists('allow_direct_booking', $config)
                ? (bool) $config['allow_direct_booking']
                : true,
            'booking_engine_url' => isset($config['booking_engine_url'])
                ? trim((string) $config['booking_engine_url'])
                : '',
        ]);
        break;

    case 'book':
        if ($method !== 'POST') {
            json_out(405, ['ok' => false, 'error' => 'method', 'message' => 'POST required']);
        }
        $allow = array_key_exists('allow_direct_booking', $config)
            ? (bool) $config['allow_direct_booking']
            : true;
        if (!$allow) {
            json_out(403, ['ok' => false, 'error' => 'booking_disabled']);
        }
        if (!rate_limit_ok('book:' . client_ip(), 6, 3600)) {
            json_out(429, ['ok' => false, 'error' => 'rate_limit', 'message' => 'Troppe richieste. Riprova più tardi.']);
        }

        $raw = file_get_contents('php://input');
        $posted = json_decode((string) $raw, true);
        if (!is_array($posted)) {
            bad_request('JSON body required');
        }
        // Honeypot: bots filling hidden field
        if (!empty($posted['website']) || !empty($posted['company'])) {
            json_out(200, ['ok' => true, 'status' => 204, 'data' => ['id' => 'ok']]);
        }

        $checkin = isset($posted['checkin']) ? (string) $posted['checkin'] : '';
        $checkout = isset($posted['checkout']) ? (string) $posted['checkout'] : '';
        $guests = isset($posted['guests']) ? (int) $posted['guests'] : 2;
        $name = trim((string) ($posted['name'] ?? ''));
        $surname = trim((string) ($posted['surname'] ?? ''));
        $email = trim((string) ($posted['email'] ?? ''));
        $phone = trim((string) ($posted['phone'] ?? ''));
        $note = trim((string) ($posted['note'] ?? ''));
        $lang = (string) ($posted['language'] ?? 'it');
        $id = isset($posted['accommodation'])
            ? preg_replace('/\D/', '', (string) $posted['accommodation'])
            : (isset($_GET['accommodation']) ? preg_replace('/\D/', '', (string) $_GET['accommodation']) : $defaultAcc);

        if ($id === '') {
            bad_request('accommodation id required');
        }
        if (!date_ok($checkin) || !date_ok($checkout)) {
            bad_request('checkin and checkout YYYY-MM-DD required');
        }
        if ($checkout <= $checkin) {
            bad_request('checkout must be after checkin');
        }
        if ($guests < 1 || $guests > 8) {
            bad_request('guests must be 1–8');
        }
        if (strlen($name) < 2) {
            bad_request('name required');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            bad_request('valid email required');
        }
        if (strlen($note) > 1500) {
            $note = substr($note, 0, 1500);
        }
        if (strlen($phone) > 40) {
            $phone = substr($phone, 0, 40);
        }

        $avail = avaibook_request($base, $token, 'GET', '/api/owner/accommodations/' . $id . '/availability/', [
            'startDate' => $checkin,
            'endDate' => $checkout,
        ]);
        if (empty($avail['ok'])) {
            json_out($avail['code'] ?: 502, [
                'ok' => false,
                'error' => 'availability_failed',
                'status' => $avail['code'],
                'data' => $avail['json'],
            ]);
        }
        $availCode = $avail['json'];
        if ($availCode !== 1 && $availCode !== '1') {
            json_out(409, [
                'ok' => false,
                'error' => 'not_available',
                'message' => 'Date non disponibili.',
                'availability' => $availCode,
            ]);
        }

        $priceRes = avaibook_request($base, $token, 'GET', '/api/owner/accommodations/' . $id . '/booking-price/', [
            'checkinDate' => $checkin,
            'checkoutDate' => $checkout,
            'travelers' => $guests,
        ]);
        if (empty($priceRes['ok']) || $priceRes['json'] === null) {
            json_out($priceRes['code'] ?: 502, [
                'ok' => false,
                'error' => 'price_failed',
                'status' => $priceRes['code'],
                'data' => $priceRes['json'],
            ]);
        }
        $priceRows = $priceRes['json'];
        if (!is_array($priceRows)) {
            json_out(502, ['ok' => false, 'error' => 'price_failed']);
        }
        $p0 = (isset($priceRows[0]) && is_array($priceRows[0])) ? $priceRows[0] : $priceRows;
        $pStatus = strtoupper((string) ($p0['status'] ?? ''));
        if ($pStatus === 'NOT_AVAILABLE') {
            json_out(409, ['ok' => false, 'error' => 'not_available', 'message' => 'Date non disponibili.']);
        }
        $total = isset($p0['total']) ? (float) $p0['total'] : 0;
        $advance = isset($p0['advance']) ? (float) $p0['advance'] : 0;
        if ($total <= 0) {
            json_out(502, ['ok' => false, 'error' => 'price_failed', 'message' => 'Prezzo AvaiBook non valido.']);
        }

        $unitId = 0;
        if (!empty($config['default_unit_id'])) {
            $unitId = (int) $config['default_unit_id'];
        }
        if (!$unitId && !empty($p0['unit']['id'])) {
            $unitId = (int) $p0['unit']['id'];
        }
        if (!$unitId) {
            $accRes = avaibook_request($base, $token, 'GET', '/api/owner/accommodations/');
            if (!empty($accRes['ok'])) {
                $unitId = first_unit_id($accRes['json'], $id);
            }
        }
        if ($unitId <= 0) {
            json_out(502, ['ok' => false, 'error' => 'unit_missing', 'message' => 'Imposta default_unit_id in config.php.']);
        }

        $status = strtoupper((string) ($config['booking_status'] ?? 'PENDING_PAYMENT'));
        if ($status !== 'CONFIRMED') {
            $status = 'PENDING_PAYMENT';
        }

        $payload = [
            'status' => $status,
            'checkInDate' => $checkin,
            'checkOutDate' => $checkout,
            'travellers' => $guests,
            'totalAmount' => $total,
            'advance' => $advance,
            'travellerEmail' => $email,
            'travellerName' => $name,
            'unitId' => $unitId,
            'travellerLanguage' => lang_to_avaibook($lang),
            'ownerReference' => 'magentastay.it',
            'internalNote' => 'Prenotazione da magentastay.it · Sanchioli 11 · CIN IT015130C2SMSD6MZG',
        ];
        if ($surname !== '') {
            $payload['travellerSurname'] = $surname;
        }
        if ($phone !== '') {
            $payload['travellerPhone'] = $phone;
        }
        if ($note !== '') {
            $payload['travellerNote'] = $note;
        }

        $created = avaibook_request($base, $token, 'POST', '/api/owner/bookings/', [], $payload);
        if (empty($created['ok'])) {
            $msg = 'AvaiBook ha rifiutato la prenotazione.';
            if ((int) $created['code'] === 401 || (int) $created['code'] === 403) {
                $msg = 'AvaiBook deve certificare POST /bookings/ (form API + test su .biz) prima di creare pratiche dal sito.';
            }
            json_out($created['code'] ?: 502, [
                'ok' => false,
                'error' => ((int) $created['code'] === 401 || (int) $created['code'] === 403)
                    ? 'not_certified'
                    : 'booking_failed',
                'message' => $msg,
                'status' => $created['code'],
                'data' => $created['json'],
            ]);
        }

        $booking = is_array($created['json']) ? $created['json'] : [];
        $bookingId = (string) ($booking['id'] ?? '');
        $messageOk = false;
        if ($bookingId !== '') {
            $channel = "Prenotazione da magentastay.it (Sanchioli 11)\n";
            $channel .= "Check-in: $checkin · Check-out: $checkout · Ospiti: $guests\n";
            $channel .= "Ospite: $name" . ($surname !== '' ? " $surname" : '') . " · $email";
            if ($phone !== '') {
                $channel .= " · $phone";
            }
            if ($note !== '') {
                $channel .= "\nNota: $note";
            }
            if (strlen($channel) > 3200) {
                $channel = substr($channel, 0, 3200);
            }
            $msgRes = avaibook_request($base, $token, 'POST', '/api/owner/messages/', [], [
                'booking_id' => $bookingId,
                'message' => $channel,
            ]);
            $messageOk = !empty($msgRes['ok']) || (int) ($msgRes['code'] ?? 0) === 204;
        }

        json_out($created['code'] ?: 200, [
            'ok' => true,
            'status' => $created['code'],
            'data' => $booking,
            'booking_id' => $bookingId,
            'message_ok' => $messageOk,
            'total' => $total,
            'advance' => $advance,
        ]);
        break;

    default:
        bad_request('action must be accommodations|calendar|availability|price|ping|book');
}
