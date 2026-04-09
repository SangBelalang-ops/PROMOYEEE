const API_KEY = "aFVBKbUGW15JPwN3to5L7DiyN0QY1syLI4p4jVQ5N0VnsgYHRs";

async function cekRekening() {
    const bank = document.getElementById('bankCode').value;
    const norek = document.getElementById('accNumber').value;
    const hasil = document.getElementById('result');

    if (!bank || !norek) return alert("Pilih Bank & Isi Nomor Rekening!");

    hasil.innerHTML = "<span style='color: #00ffff'>Sabar, lagi diintip...</span>";

    // Cek apakah e-wallet atau bank buat nentuin endpoint
    const isEwallet = ["dana", "ovo", "gopay", "linkaja", "shopeepay"].includes(bank.toLowerCase());
    const endpoint = isEwallet ? "getEwalletAccount" : "getBankAccount";
    
    try {
        const response = await fetch(`https://api-rekening.lfourr.com/${endpoint}?bankCode=${bank}&accountNumber=${norek}`, {
            headers: { 'x-api-key': API_KEY }
        });
        
        const res = await response.json();

        if (res.status === true || res.status === "success") {
            const nama = res.data.name || res.data.account_name;
            hasil.innerHTML = `NAMA:<br><b style="color: #00ff00; font-size: 20px;">${nama.toUpperCase()}</b>`;
        } else {
            hasil.innerHTML = "<span style='color: #ffae00;'>Data Gak Ada! Salah input kali.</span>";
        }
    } catch (err) {
        hasil.innerHTML = "<span style='color: #ff0000;'>Server API Ngambek!</span>";
    }
}
