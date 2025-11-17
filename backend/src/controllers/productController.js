import product from "../models/product.js";
import order from "../models/order.js";
import {get_url} from "./imageController.js"

export const get_all_products = async (req, res) => {
    try {
        const products = await product.find()
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error: error.message });
    }
}

export const get_filter_products = async (req, res) => {
    try {
        let filter = {}
        const { TACGIA, NXB, minPrice, maxPrice, sort, order } = req.query

        if (TACGIA) filter.TACGIA = TACGIA
        if (NXB) filter.NXB = NXB
        if (minPrice || maxPrice) {
            filter.GIABAN = {}
            if (minPrice) filter.GIABAN.$gte = Number(minPrice)
            if (maxPrice) filter.GIABAN.$lte = Number(maxPrice)
        }
        let sort_option = {};
        if (sort) {
            sort_option[sort] = order === 'desc' ? -1 : 1;
        }

        const products = await product.find(filter).sort(sort_option);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error: error.message });
    }
}

export const add_product = async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = new product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error: error.message });
    }
}

export const delete_product = async (req, res) => {
    try {
        const productId = req.params.id;
        await product.findByIdAndDelete(productId);
        res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
    }
}

export const update_product = async (req, res) => {
    try {
        const productId = req.query.id;
        const updateData = req.body;
        const updatedProduct = await product.findByIdAndUpdate(productId, updateData, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
    }
}

export const get_product_by_id = async (req, res) => {
    try {
        const productId = req.query.id;
        const book = await product.findById(productId);
        if (!book) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        const signedUrls = [];

        if (book.IMG && book.IMG.length > 0) {
            for (const name of book.IMG) {
                const url = await get_url(name);
                signedUrls.push(url);
            }
        }
        res.status(200).json({
            ...book.toObject(),
            IMAGE_URL: signedUrls
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin sản phẩm", error: error.message });
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
                    img: "$product_info.IMG"
                }
            }
        ]);
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_bestsellers", error: error.message })
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

function removeVietnameseTones(str) {
    str = str.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
    str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
    str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
    str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
    str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
    str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
    str = str.replace(/đ/gi, "d");
    // bỏ dấu câu và khoảng trắng thừa
    str = str.replace(/\s+/g, ' ').trim();
    return str;
}

export const search_products = async (req, res) => {
    try {
        const { name } = req.query; // lấy từ query param
        console.log(name)
        if (!name || name.length < 1) {
            return res.status(400).json({ message: "Vui lòng nhập từ khóa" });
        }

        name = removeVietnameseTones(name)

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

export const get_all_NXB = async (req, res) => {
    try {
        const nxb = await product.aggregate([
            {
                $group: {
                    _id: "$NXB",
                    total_books: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    NXB: "$_id",
                    total_books: "$total_books"
                }
            }
        ])

        res.status(200).json(nxb)
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_all_NXB" })
    }
}

export const get_all_TACGIA = async (req, res) => {
    try {
        const nxb = await product.aggregate([
            {
                $group: {
                    _id: "$TACGIA",
                    total_books: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    NXB: "$_id",
                    total_books: "$total_books"
                }
            }
        ])

        res.status(200).json(nxb)
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_all_TACGIA" })
    }
}