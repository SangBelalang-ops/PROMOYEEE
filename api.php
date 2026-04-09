<?php
header('Content-Type: application/json');

// --- API KEY KAMU SUDAH SAYA PASANG ---
$API_KEY_COID   = "xy9sQ9AcQwFZcNeiSTSrwZoEDGh9dsdW7e8IJ2GqAlgsb72oqX"; 
$API_KEY_GEMINI = "AIzaSyDoC3xsK5VY8lLKlWgGkCKW7rooQvylORo";

$bank    = $_GET['bank'] ?? '';
$account = $_GET['account'] ?? '';

if (!$bank || !$account) {
    echo json_encode(['status' => 'error', 'message' => 'Input tidak lengkap']);
    exit;
}

// 1. CEK KE API.CO.ID
// Kita gunakan endpoint standar premium mereka
$url_coid = "https://api.co.id/v1/bank/check?bank=$bank&account=$account";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url_coid);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $API_KEY_COID",
    "Accept: application/json"
]);

$res_coid = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data_coid = json_decode($res_coid, true);

// 2. LOGIKA PEMBACAAN HASIL
$isSuccess = false;
$nama_pemilik = "";

// Cek berbagai kemungkinan format sukses (api.co.id kadang beda versi)
if (($http_code == 200) && isset($data_coid['data'])) {
    $nama_pemilik = $data_coid['data']['name'] ?? $data_coid['data']['account_name'] ?? "";
    if ($nama_pemilik != "") {
        $isSuccess = true;
    }
}

// 3. JIKA SUKSES, TANYA GEMINI AI
$ai_msg = "Selalu pastikan nama pemilik rekening sesuai sebelum melakukan transfer.";
if ($isSuccess) {
    $url_ai = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$API_KEY_GEMINI";
    $prompt = ["contents" => [["parts" => [["text" => "Berikan 1 kalimat tips singkat keamanan transfer bank untuk rekening atas nama $nama_pemilik."]]]]];
    
    $ch2 = curl_init($url_ai);
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch2, CURLOPT_POST, true);
    curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode($prompt));
    curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $res_ai = curl_exec($ch2);
    $data_ai = json_decode($res_ai, true);
    $ai_msg = $data_ai['candidates'][0]['content']['parts'][0]['text'] ?? $ai_msg;
    curl_close($ch2);
}

// Kirim hasil ke index.html
echo json_encode([
    'success'      => $isSuccess,
    'nama'         => $nama_pemilik,
    'ai_analysis'  => $ai_msg,
    'debug'        => $data_coid // Untuk melihat error jika gagal
]);
