async function cekRekening() {
    const bank = document.getElementById('bankCode').value;
    const norek = document.getElementById('accNumber').value;
    const namaInput = document.getElementById('accName').value; // WAJIB ADA BUAT API INI
    const hasil = document.getElementById('result');
    
    // DETAIL DARI DOKUMENTASI LO
    const API_KEY = "aFVBKbUGW15JPwN3to5L7DiyN0QY1syLI4p4jVQ5N0VnsgYHRs"; 
    const BASE_URL = "https://use.api.co.id/validation/bank";

    if(!bank || !norek || !namaInput) return alert("Bank, No Rekening, dan Nama harus diisi!");

    hasil.innerHTML = "<span style='color:cyan'>Validating...</span>";

    // Format URL sesuai dokumentasi (Query Params)
    const params = new URLSearchParams({
        bank_code: bank,
        account_number: norek,
        account_name: namaInput
    });

    try {
        const response = await fetch(`${BASE_URL}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'x-api-co-id': API_KEY // HEADER SESUAI DOKUMEN LO
            }
        });

        const res = await response.json();

        if (res.is_valid === true) {
            // is_valid: true artinya score >= 7.0
            hasil.innerHTML = `
                <div style="color:#00ff00">
                    ✅ VALID! <br>
                    NAMA: ${res.name} <br> 
                    SCORE: ${res.score}
                </div>`;
        } else {
            // Kalau gagal (score rendah atau rek tidak ketemu)
            hasil.innerHTML = `
                <div style="color:#ffae00">
                    ❌ TIDAK VALID <br>
                    Pesan: ${res.message} <br>
                    Note: ${res.note || '-'}
                </div>`;
        }
    } catch (err) {
        hasil.innerHTML = "<span style='color:red'>Server API Timeout/Error!</span>";
    }
}
