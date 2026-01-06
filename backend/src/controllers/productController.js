import * as product_service from "../services/product.service.js";

export const get_all_products = async (req, res) => {
    try {
        const products = await product_service.all_products();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error: error.message });
    }
};

export const get_filter_products = async (req, res) => {
    try {
        const products = await product_service.filter_products(req.query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error: error.message });
    }
};

export const add_product = async (req, res) => {
    try {
        const newProduct = await product_service.add_product(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error: error.message });
    }
};

export const delete_product = async (req, res) => {
    try {
        const productId = req.query.id;
        await product_service.delete_product(productId);
        res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
    }
};

export const update_product = async (req, res) => {
    try {
        const productId = req.query.id;
        const updateData = req.body;
        const updatedProduct = await product_service.update_product(productId, updateData);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
    }
};

export const get_product_by_id = async (req, res) => {
    try {
        const productId = req.query.id;
        const book = await product_service.get_product_by_id(productId);
        if (!book) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin sản phẩm", error: error.message });
    }
};

export const get_bestsellers = async (req, res) => {
    try {
        const result = await product_service.get_bestsellers();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_bestsellers", error: error.message });
    }
};

export const get_most_view_books = async (req, res) => {
    try {
        const result = await product_service.get_most_view_books();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_most_view_books", error: error.message });
    }
};

export const search_products = async (req, res) => {
    try {
        const { name } = req.query;
        const products = await product_service.search_products(name);
        res.status(200).json(products);
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json({ message: "Lỗi ở search_products", error: error.message });
    }
};

export const get_all_publishers = async (req, res) => {
    try {
        const publishers = await product_service.get_all_publishers();
        res.status(200).json(publishers);
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_all_publishers", error: error.message });
    }
};

export const get_all_authors = async (req, res) => {
    try {
        const authors = await product_service.get_all_authors();
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ message: "Lỗi ở get_all_authors", error: error.message });
    }
};