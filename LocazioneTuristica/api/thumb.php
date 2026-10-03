<?php
/**
 * Magenta Stay — JPEG thumbnails (Aruba).
 * Grid uses w=640; lightbox uses w=1400. Caches under /immagini/_cache/.
 * Example: /api/thumb.php?src=immagini/sanchioli-11/foto-00.jpg&w=640
 */
$src = isset($_GET['src']) ? (string) $_GET['src'] : '';
$src = ltrim(str_replace('\\', '/', $src), '/');
$w = isset($_GET['w']) ? (int) $_GET['w'] : 640;
if ($w < 120) {
    $w = 120;
}
if ($w > 1600) {
    $w = 1600;
}

if (!preg_match('#^immagini/(sanchioli-11/foto-\d{2}|magenta/[a-z0-9._-]+|ticino/[a-z0-9._-]+)\.(jpe?g|png)$#i', $src)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'bad src';
    exit;
}

$root = realpath(dirname(__DIR__) . '/immagini');
$file = realpath(dirname(__DIR__) . '/' . $src);
if ($root === false || $file === false || strpos($file, $root) !== 0 || !is_file($file)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'not found';
    exit;
}

$cacheDir = dirname(__DIR__) . '/immagini/_cache';
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
}
$cacheName = 'w' . $w . '_' . preg_replace('/[^a-z0-9]+/i', '_', $src) . '.jpg';
$cacheFile = $cacheDir . '/' . $cacheName;

function send_jpeg($path) {
    header('Content-Type: image/jpeg');
    header('Cache-Control: public, max-age=604800');
    header('Content-Length: ' . filesize($path));
    readfile($path);
    exit;
}

if (is_file($cacheFile) && filemtime($cacheFile) >= filemtime($file)) {
    send_jpeg($cacheFile);
}

if (!function_exists('imagecreatefromjpeg')) {
    header('Location: /' . $src, true, 302);
    exit;
}

$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
if ($ext === 'png') {
    $img = @imagecreatefrompng($file);
} else {
    $img = @imagecreatefromjpeg($file);
}
if (!$img) {
    header('Location: /' . $src, true, 302);
    exit;
}

$ow = imagesx($img);
$oh = imagesy($img);
if ($ow <= $w) {
    imagedestroy($img);
    if ($ext === 'jpg' || $ext === 'jpeg') {
        send_jpeg($file);
    }
    header('Location: /' . $src, true, 302);
    exit;
}

$nh = (int) round($oh * ($w / $ow));
$out = imagecreatetruecolor($w, $nh);
imagecopyresampled($out, $img, 0, 0, 0, 0, $w, $nh, $ow, $oh);
imagedestroy($img);
$quality = $w >= 1200 ? 78 : 68;
imagejpeg($out, $cacheFile, $quality);
imagedestroy($out);
send_jpeg($cacheFile);
