
import mongoose from "mongoose"
import { user, address, product, category, coupon, order, cart, review } from "../import.js"

export const get_all_documents = async (req, res) => {
    try {
        const { collection_name } = req.params
        const data = await mongoose.model(collection_name).find()
        res.json(data)
    } catch (error) {
        console.log(`Không có collection nào tên ${collection_name}`)
        res.status(500).json({ message: "Lỗi ở get_all_documents" })
    }
}

export const add_document = async (req, res) => {
    try {
        const { collection_name } = req.params
        const Model = mongoose.model(collection_name)
        const record = new Model(req.body)
        const new_doc = await record.save()

        res.status(201).json(new_doc)
    } catch (error) {
        console.log(`Không có collection tên ${collection_name}`)
        res.status(500).json({ message: "Lỗi ở add_document" })
    }
}

export const update_a_document = async (req, res) => {
    try {
        const { collection_name, id } = req.params
        const Model = mongoose.model(collection_name)
        const updated_document = await Model.findByIdAndUpdate(id, req.body, { new: true })
        if (!update_a_document) {
            res.status(404).json({ message: `Không tồn tại id ${id} để update` })
        }
        res.status(201).json(updated_document)
    } catch (error) {
        console.log(`Không có collection tên ${collection_name}`)
        res.status(500).json({ message: "Lỗi ở update_a_document" })
    }

}

export const delete_document = async (req, res) => {
    try {
        const { collection_name, id } = req.params;
        const Model = mongoose.model(collection_name)

        const deleted_document = await Model.findByIdAndDelete(id)
        if (!deleted_document) {
            return res.status(404).json({ message: "Id không tồn tại để xóa" })
        }
        res.status(200).json(deleted_document)
    } catch (error) {
        console.log(`Không có collection nào tên ${collection_name}`)
        res.status(500).json({ message: "Lỗi ở delete_document" })
    }
}

export const get_bestsellers = async (req, res) => {
    try {
        const result = await order.aggregate([
            { $unwind: "$ITEM" }, // tách từng ITEM trong mảng ra thành dòng riêng
            {
                $group: {
                    _id: "$ITEM.PRODUCT",       // nhóm theo mã sản phẩm
                    totalSold: { $sum: "$ITEM.QUANTITY" } // cộng dồn số lượng bán
                }
            },
            {
                $lookup: {                   // nối thêm thông tin sản phẩm
                    from: "products",          // tên collection (chú ý: phải là "products" vì MongoDB tự thêm 's')
                    localField: "_id",
                    foreignField: "_id",
                    as: "product_info"
                }
            },
            { $unwind: "$product_info" }, // lấy object thay vì mảng
            { $sort: { totalSold: -1 } }, // sắp xếp giảm dần theo số lượng bán
            { $limit: 10 },               // lấy top 10 sản phẩm bán chạy
            {
                $project: {                 // chỉ hiển thị một số trường cần thiết
                    _id: 0,
                    productId: "$_id",
                    name: "$product_info.TENSACH",
                    totalSold: 1,
                    price: "$product_info.GIABAN",
                    img: "$product_info.IMG_URL"
                }
            }
        ]);
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_bestsellers" })
    }
}

export const get_most_view_books = async (req, res) => {
    try {
        const result = await product.aggregate([
            { $sort: { VIEWCOUNT: -1 } },
            { $limit: 10 }
        ])
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_most_view_books" })
    }
}

export const search_products = async (req, res) => {
    try {
        const { name } = req.query; // lấy từ query param
        console.log(name)
        if (!name || name.length < 1) {
            return res.status(400).json({ message: "Vui lòng nhập từ khóa" });
        }

        // tìm sách có tên chứa từ khóa (case-insensitive)
        const products = await product.find({
            TENSACH: { $regex: `^${name}`, $options: "i" } // i = không phân biệt hoa thường
        })
            .limit(10); // giới hạn số kết quả trả về

        res.json(products);
    } catch (error) {
        console.error("Lỗi ở search_products");
        res.status(500).json({ message: "Lỗi ở search_products" });
    }
};