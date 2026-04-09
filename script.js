// Ganti dengan URL endpoint resmi dari dashboard api.co.id lo
const API_BASE = "https://api.co.id/v1"; 
const API_KEY = "aFVBKbUGW15JPwN3to5L7DiyN0QY1syLI4p4jVQ5N0VnsgYHRs";

async function cekRekening() {
    const bank = document.getElementById('bankCode').value;
    const norek = document.getElementById('accNumber').value;
    const hasil = document.getElementById('result');

    if (!bank || !norek) return alert("Pilih Bank & Isi Nomor!");

    hasil.innerText = "Sedang Memproses...";

    try {
        // Sesuaikan endpoint-nya dengan dokumentasi api.co.id
        // Biasanya: /bank/account-lookup atau /check
        const response = await fetch(`${API_BASE}/bank/check?bank_code=${bank}&account_number=${norek}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY // Pakai Key lo yang sakti itu
            }
        });

        const res = await response.json();

        // Cek struktur JSON dari api.co.id (biasanya ada di field 'data' atau 'result')
        if (res.status === "success" || res.success === true) {
            const namaPemilik = res.data.account_name || res.data.name;
            hasil.innerHTML = `NAMA PEMILIK:<br><b style="color: #00ff00; font-size: 22px;">${namaPemilik.toUpperCase()}</b>`;
        } else {
            hasil.innerHTML = `<span style="color: #ffae00;">${res.message || "Data Tidak Valid"}</span>`;
        }
    } catch (err) {
        hasil.innerText = "Koneksi API Gagal!";
        console.error(err);
    }
}
