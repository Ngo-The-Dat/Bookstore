import 'dotenv/config'
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})

export const converse = async (req, res) => {
    try {
        const message = req.body.message;
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [
                { role: "system", text: "Bạn là AI tư vấn sách của cửa hàng. Chỉ trả lời các câu hỏi liên quan đến sách, sản phẩm sách, tác giả, thể loại, nội dung sách hoặc đánh giá khách hàng. Nếu câu hỏi không liên quan đến sách, hãy trả lời: \"Tôi chỉ hỗ trợ tư vấn sách.\" Tuyệt đối không bàn sang chủ đề khác." },
                { role: "user", text: message }
            ]
        })

        res.status(201).json({ answer: result.text })
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở converse", error: error })
    }
}