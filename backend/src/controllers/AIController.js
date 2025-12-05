import 'dotenv/config'
import { GoogleGenAI } from "@google/genai";
import product from '../models/product.js';
import category from '../models/category.js'

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})

const instruction = `
Bạn là AI tư vấn sách của cửa hàng.
NHIỆM VỤ:
1. Dựa vào "DANH SÁCH SÁCH HIỆN CÓ" được cung cấp bên dưới để trả lời khách hàng. 
2. Nếu sách khách hỏi KHÔNG có trong danh sách cung cấp, hãy nói khéo là cửa hàng hiện chưa có và gợi ý sách khác trong danh sách. 
3. Nếu câu hỏi không liên quan đến sách, hãy trả lời: \"Tôi chỉ hỗ trợ tư vấn sách.\" 
4. Tuyệt đối không bàn sang chủ đề khác.
5. Tuyệt đối không được bịa ra sách không có trong dữ liệu
6. Trả lời ngắn gọn, thân thiện, tập trung vào giá bán và nội dung
7. Thông tin mô tả sách có thể tham khảo trên internet`

export const converse = async (req, res) => {
    try {
        const message = req.body.message;
        
        const relevant_books = await product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "CATEGORY",
                    foreignField: "_id",
                    as: "category_info"
                }
            },
            {$unwind: "$category_info"},
            {
                $project: {
                    _id: 0,
                    TENSACH: 1,
                    GIABAN: 1,
                    TACGIA: 1,
                    TONKHO: 1,
                    MOTA: 1,
                    CATEGORY: "$category_info.TENDM"
                }
            }
        ])

        let book_context = "";
        if (relevant_books.length > 0) {
            book_context = "Dưới đây là thông tin sách hiện có trong kho phù hợp với câu hỏi:\n"
            relevant_books.forEach(book => {
                book_context += `-Tên: ${book.TENSACH}, Giá bán: ${book.GIABAN} VNĐ, Tác giả: ${book.TACGIA}, Tồn kho: ${book.TONKHO}, Mô tả: ${book.MOTA}, Thể loại: ${book.CATEGORY}\n`
            })
        } else {
            book_context = "Hiện tại hệ thống không tìm thấy sách nào khớp trong kho dữ liệu."
        }
        
        const final_prompt = `
        THÔNG TIN DỮ LIỆU TỪ DATABASE (Sử dụng thông tin này để trả lời, không được bịa đặt):
        ${book_context}
        
        Câu hỏi của khách hàng: "${message}"
        `; 
        const respond = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            config: {
                systemInstruction: instruction
            },
            contents: [
                { role: "user", text: final_prompt }
            ]
        })
        
        res.status(201).json({ answer: respond.text })
        
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở converse", error })
    }
}