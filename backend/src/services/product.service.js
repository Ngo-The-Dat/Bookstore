import product from "../models/product.js";
import order from "../models/order.js";

export const all_products = async () => {
    return await product.find();
};

export const filter_products = async (query_params) => {
    let filter = {};
    // lấy thông tin từ query để tạo object filter
    const { TACGIA, NXB, minPrice, maxPrice, sort, order } = query_params;
    // nhét dữ liệu từ query vào filter
    if (TACGIA) filter.TACGIA = TACGIA;
    if (NXB) filter.NXB = NXB;
    if (minPrice || maxPrice) {
        filter.GIABAN = {};
        if (minPrice) filter.GIABAN.$gte = Number(minPrice);
        if (maxPrice) filter.GIABAN.$lte = Number(maxPrice);
    }
    // nếu có sort(TACGIA, NXB,...) thì tạo sort_option và sort theo biến order (giảm = -1 & tăng = 1)
    let sort_option = {};
    if (sort) {
        sort_option[sort] = order === 'desc' ? -1 : 1;
    }
    // Lấy sách được sort từ filter và sort_option
    const products = await product.find(filter).sort(sort_option);
    return products;
};

export const add_product = async (body) => {
    const newProduct = new product(body);
    await newProduct.save();
    return newProduct;
};

export const delete_product = async (id) => {
    return product.findByIdAndDelete(id);
};

export const update_product = async (id, updateData) => {
    return product.findByIdAndUpdate(id, updateData, { new: true });
};

export const get_product_by_id = async (id) => {
    return product.findById(id);
};

export const get_bestsellers = async () => {
    const result = await order.aggregate([
        { $unwind: "$ITEM" },
        {
            $group: {
                _id: "$ITEM.PRODUCT",
                totalSold: { $sum: "$ITEM.QUANTITY" }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product_info"
            }
        },
        { $unwind: "$product_info" },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                name: "$product_info.TENSACH",
                totalSold: 1,
                price: "$product_info.GIABAN",
                img: "$product_info.IMG"
            }
        }
    ]);

    return result;
};

export const get_most_view_books = async () => {
    const result = await product.aggregate([
        { $sort: { VIEWCOUNT: -1 } },
        { $limit: 10 }
    ]);
    return result;
};

const removeVietnameseTones = (str) => {
    str = str.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
    str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
    str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
    str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
    str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
    str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
    str = str.replace(/đ/gi, "d");
    str = str.replace(/\s+/g, " ").trim();
    return str;
};

export const search_products = async (rawName) => {
    if (!rawName || !rawName.trim()) {
        const error = new Error("Vui lòng nhập từ khóa");
        error.statusCode = 400;
        throw error;
    }

    const normalized = removeVietnameseTones(rawName.trim());

    const products = await product
        .find({ TENSACH: { $regex: normalized, $options: "i" } })

    return products;
};

export const get_all_NXB = async () => {
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
    ]);

    return nxb;
};

export const get_all_TACGIA = async () => {
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
    ]);

    return nxb;
};