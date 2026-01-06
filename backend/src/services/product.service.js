import product from "../models/product.js";
import order from "../models/order.js";
import removeVietnameseTones from "../utils/productUtils.js";

export const all_products = async () => {
    return await product.find();
};

export const filter_products = async (query_params) => {
    let filter = {};
    // lấy thông tin từ query để tạo object filter
    const { AUTHOR, PUBLISHER, minPrice, maxPrice, sort, order } = query_params;
    // nhét dữ liệu từ query vào filter
    if (AUTHOR) filter.AUTHOR = AUTHOR;
    if (PUBLISHER) filter.PUBLISHER = PUBLISHER;
    if (minPrice || maxPrice) {
        filter.SALE_PRICE = {};
        if (minPrice) filter.SALE_PRICE.$gte = Number(minPrice);
        if (maxPrice) filter.SALE_PRICE.$lte = Number(maxPrice);
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
                name: "$product_info.TITLE",
                totalSold: 1,
                price: "$product_info.SALE_PRICE",
                img: "$product_info.IMAGE_CARD"
            }
        }
    ]);

    return result;
};

export const get_most_view_books = async () => {
    const result = await product.aggregate([
        { $sort: { VIEW_COUNT: -1 } },
        { $limit: 10 }
    ]);
    return result;
};

export const search_products = async (rawName) => {
    if (!rawName || !rawName.trim()) {
        const error = new Error("Vui lòng nhập từ khóa");
        error.statusCode = 400;
        throw error;
    }

    const normalized = removeVietnameseTones(rawName.trim());

    const products = await product
        .find({ SLUG: { $regex: normalized, $options: "i" } });

    return products;
};

export const get_all_NXB = async () => {
    const nxb = await product.aggregate([
        {
            $group: {
                _id: "$PUBLISHER",
                total_books: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                PUBLISHER: "$_id",
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
                _id: "$AUTHOR",
                total_books: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                AUTHOR: "$_id",
                total_books: "$total_books"
            }
        }
    ]);

    return nxb;
};