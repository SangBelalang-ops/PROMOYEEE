async function cekRekening() {
    const bank = document.getElementById('bankCode').value;
    const norek = document.getElementById('accNumber').value;
    const hasil = document.getElementById('result');
    
    // API KEY LO
    const API_KEY = "aFVBKbUGW15JPwN3to5L7DiyN0QY1syLI4p4jVQ5N0VnsgYHRs"; 
    
    // PAKAI PROXY BIAR GAK BLOCKED
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const targetUrl = `https://use.api.co.id/v1/bank/inquiry?bank_code=${bank}&account_number=${norek}`;

    if(!bank || !norek) return alert("Pilih Bank & Isi Nomor!");

    hasil.innerHTML = "<span style='color:cyan'>Menghubungkan ke Server Bank...</span>";

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            headers: {
                // Catatan: Beberapa proxy mungkin butuh header di dalam URL-nya
                // Tapi kita coba cara standar dulu
            }
        });

        const data = await response.json();
        // allorigins ngebungkus responnya di dalam field 'contents'
        const res = JSON.parse(data.contents);

        if (res.status === "success" || res.success === true) {
            const namaFull = res.data.account_name || res.data.name;
            hasil.innerHTML = `NAMA PEMILIK:<br><b style="color:#00ff00; font-size:22px;">${namaFull.toUpperCase()}</b>`;
        } else {
            hasil.innerHTML = `<span style='color:#ffae00;'>GAGAL: ${res.message || "Data Tidak Ditemukan"}</span>`;
        }
    } catch (err) {
        hasil.innerHTML = "<span style='color:red;'>SERVER ERROR!<br><small>Cek saldo atau pastikan API Key lo aktif.</small></span>";
        console.error(err);
    }
}
