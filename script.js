export default async function handler(req, res) {
    const { bank, account } = req.query;
    
    // Key diambil dari Environment Variables yang kamu isi di Vercel Dashboard
    const COID_KEY = process.env.COID_KEY;
    const GEMINI_KEY = process.env.GEMINI_KEY;

    try {
        // 1. Panggil API.CO.ID (Server to Server - Gak bakal kena CORS)
        const coidResp = await fetch(`https://api.co.id/v1/bank/check?bank=${bank}&account=${account}`, {
            headers: { 
                'Authorization': `Bearer ${COID_KEY}`,
                'Accept': 'application/json'
            }
        });
        const bankData = await coidResp.json();

        if (bankData.status === "success" || bankData.status === 200) {
            const nama = bankData.data.name;

            // 2. Panggil Gemini AI
            const geminiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `Berikan 1 kalimat tips keamanan transfer ke ${bank} atas nama ${nama}.` }] }] })
            });
            const geminiData = await geminiResp.json();
            const aiText = geminiData.candidates[0].content.parts[0].text;

            return res.status(200).json({ success: true, nama, aiText });
        } else {
            return res.status(404).json({ success: false, message: "Rekening tidak ditemukan." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
}
