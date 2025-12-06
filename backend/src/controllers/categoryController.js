import * as category_service from "../services/category.service.js"

export const get_all_categories = async (req, res) => {
    try {
        const categories = await category_service.all_categories();
        res.status(201).json(categories)
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_all_categories", error })
    }
}