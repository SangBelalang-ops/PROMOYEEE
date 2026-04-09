async function cekRekening() {
    const bank = document.getElementById('bankCode').value;
    const norek = document.getElementById('accNumber').value;
    const hasil = document.getElementById('result');
    
    const API_KEY = "aFVBKbUGW15JPwN3to5L7DiyN0QY1syLI4p4jVQ5N0VnsgYHRs";
    const URL = "https://use.api.co.id/v1/bank/account-validation"; // Sesuai endpoint mereka

    if(!bank || !norek) return alert("Isi data dulu!");

    hasil.innerText = "Checking...";

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                bank_code: bank,
                account_number: norek
            })
        });

        const res = await response.json();

        // api.co.id biasanya ngasih response 'account_name'
        if (res.status === "success" || res.success === true) {
            const nama = res.data.account_name || res.data.name;
            hasil.innerHTML = `NAMA: <br><b style="color:#00ff00; font-size:20px;">${nama.toUpperCase()}</b>`;
        } else {
            hasil.innerText = res.message || "Data Tidak Ditemukan";
        }
    } catch (err) {
        hasil.innerText = "Koneksi Error!";
    }
}
