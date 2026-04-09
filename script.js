// api/check.js
export default async function handler(req, res) {
    const { bank, account } = req.query;
    
    // Mengambil Key yang sudah kamu setting di Dashboard Vercel tadi
    const COID_KEY = process.env.COID_KEY;
    const GEMINI_KEY = process.env.GEMINI_KEY;

    try {
        // 1. Cek Rekening
        const coidResp = await fetch(`https://api.co.id/v1/bank/check?bank=${bank}&account=${account}`, {
            headers: { 'Authorization': `Bearer ${COID_KEY}` }
        });
        const bankData = await coidResp.json();

        if (bankData.status === "success" || bankData.status === 200) {
            const nama = bankData.data.name;

            // 2. Tanya Gemini
            const geminiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `Berikan 1 tips singkat keamanan transfer ke bank ${bank} atas nama ${nama}.` }] }] })
            });
            const geminiData = await geminiResp.json();
            const aiText = geminiData.candidates[0].content.parts[0].text;

            return res.status(200).json({ success: true, nama, aiText });
        } else {
            return res.status(404).json({ success: false, message: "Tidak ditemukan" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
