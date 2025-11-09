
import { user, address, product, category, coupon, order, cart, review } from "../import.js"

export const get_all_task = async (req, res) => {
    try {
        res.status(200).send("ban co 200 task")
    } catch (error) {
        console.log("Lỗi ở getAllTask")
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const get_all_categories = async (req, res) => {
    try {
        const category_list = await category.find()
        res.json(category_list)
    } catch (error) {
        console.log("Lỗi ở getAllCategories")
        res.status(500).json({ message: "Lỗi ở getAllCategories" })
    }
}

export const add_category = async (req, res) => {
    try {
        const record = req.body;
        const catalog = new category(record)

        const new_catalog = await catalog.save();
        res.status(201).json(new_catalog)
    } catch (error) {
        console.log("Lỗi ở add_category")
        res.status(500).json({ message: "Lỗi ở add_category" })
    }
}

export const update_category = async (req, res) => {
    try {
        const record = req.body;
        const updated_catalog = await category.findByIdAndUpdate(
            req.params.id,
            record,
            { new: true }
        );

        if (!updated_catalog) {
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại" })
        }
        res.status(200).json(updated_catalog)
    } catch (error) {
        console.log("Lỗi ở update_category")
        res.status(500).json({ message: "Lỗi ở update_category" })
    }
}

export const delete_category = async (req, res) => {
    try {
        const deleted_catalog = await category.findByIdAndDelete(req.params.id)
        if (!deleted_catalog) {
            return res.status(404).json({ message: "Danh mục không tồn tại để xóa" })
        }
        res.status(200).json(delete_category)
    } catch (error) {
        console.log("Lỗi ở delete_category")
        res.status(500).json({ message: "Lỗi ở delete_category" })
    }
}

export const get_bestsellers = async (req, res) => {

}