async function cekRekening() {
    const bank = document.getElementById('bank').value;
    const norek = document.getElementById('norek').value;
    const apiKey = 'KUNCI_API_PREMIUM_KAMU'; // Simpan di env kalau sudah di Vercel

    try {
        const response = await fetch(`https://api.co.id/v1/bank/check?bank=${bank}&account=${norek}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        const data = await response.json();
        
        if(data.status === 'success') {
            document.getElementById('hasil').innerText = "Nama Pemilik: " + data.account_name;
        } else {
            document.getElementById('hasil').innerText = "Rekening Tidak Ditemukan!";
        }
    } catch (error) {
        console.error("Error Koneksi!", error);
        alert("Cek saldo atau status Key di dashboard!");
    }
}
