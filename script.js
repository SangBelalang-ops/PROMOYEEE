async function cekRekening() {
    const bank = document.getElementById('bankCode').value;
    const norek = document.getElementById('accNumber').value;
    const hasil = document.getElementById('result');
    
    const API_KEY = "aFVBKbUGW15JPwN3to5L7DiyN0QY1syLI4p4jVQ5N0VnsgYHRs"; 
    const BASE_URL = "https://use.api.co.id/validation/bank";

    if(!bank || !norek) return alert("Pilih bank dan isi nomor rekening!");

    hasil.innerHTML = "<span style='color:cyan'>Lagi diintip...</span>";

    // TRIK: Kita kasih nama asal "Cek" biar server mau proses
    const params = new URLSearchParams({
        bank_code: bank,
        account_number: norek,
        account_name: "Cek" 
    });

    try {
        const response = await fetch(`${BASE_URL}?${params.toString()}`, {
            method: 'GET',
            headers: { 'x-api-co-id': API_KEY }
        });

        const res = await response.json();

        // Di dokumentasi lo, kalau rek ketemu, dia tetep balikin field 'name' 
        // meskipun is_valid mungkin false (karena nama "Cek" gak cocok sama nama asli)
        if (res.name) {
            hasil.innerHTML = `NAMA PEMILIK:<br><b style="color:#00ff00; font-size:22px;">${res.name.toUpperCase()}</b>`;
        } else {
            hasil.innerHTML = `<span style='color:#ffae00;'>${res.message || "Gak Ketemu, Bro!"}</span>`;
        }
    } catch (err) {
        hasil.innerHTML = "<span style='color:red'>Server API Ngambek!</span>";
    }
}
