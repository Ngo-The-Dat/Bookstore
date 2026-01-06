import React, { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        TENSACH: "",
        GIABIA: "",
        GIABAN: "",
        MOTA: "",
        TACGIA: "",
        NXB: "",
        SOTRANG: "",
        TONKHO: "",
        IMG_CARD: "",
        CATEGORY: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                adminService.getAllProducts(),
                adminService.getAllCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setEditingProduct(null);
        setFormData({
            TENSACH: "",
            GIABIA: "",
            GIABAN: "",
            MOTA: "",
            TACGIA: "",
            NXB: "",
            SOTRANG: "",
            TONKHO: "",
            IMG_CARD: "",
            CATEGORY: categories[0]?._id || ""
        });
        setShowModal(true);
    };

    const handleOpenEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            TENSACH: product.TENSACH || "",
            GIABIA: product.GIABIA || "",
            GIABAN: product.GIABAN || "",
            MOTA: product.MOTA || "",
            TACGIA: product.TACGIA || "",
            NXB: product.NXB || "",
            SOTRANG: product.SOTRANG || "",
            TONKHO: product.TONKHO || "",
            IMG_CARD: product.IMG_CARD || "",
            CATEGORY: product.CATEGORY?._id || product.CATEGORY || ""
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            GIABIA: Number(formData.GIABIA),
            GIABAN: Number(formData.GIABAN),
            SOTRANG: Number(formData.SOTRANG),
            TONKHO: Number(formData.TONKHO)
        };

        try {
            if (editingProduct) {
                await adminService.updateProduct(editingProduct._id, payload);
                toast.success("Đã cập nhật sản phẩm");
            } else {
                await adminService.addProduct(payload);
                toast.success("Đã thêm sản phẩm mới");
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Lỗi khi lưu sản phẩm");
        }
    };

    const handleDelete = async (productId, productName) => {
        if (!confirm(`Bạn có chắc muốn xóa "${productName}"?`)) return;

        try {
            await adminService.deleteProduct(productId);
            toast.success("Đã xóa sản phẩm");
            loadData();
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm");
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    const filteredProducts = products.filter(product =>
        product.TENSACH?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.TACGIA?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.NXB?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm sách
                </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group">
                        <div className="aspect-[3/4] relative overflow-hidden bg-slate-700/50">
                            {product.IMG_CARD ? (
                                <img
                                    src={product.IMG_CARD}
                                    alt={product.TENSACH}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={() => handleOpenEdit(product)}
                                    className="p-2 bg-slate-900/80 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id, product.TENSACH)}
                                    className="p-2 bg-slate-900/80 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">{product.TENSACH}</h3>
                            <p className="text-white/50 text-xs mb-2">{product.TACGIA}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-cyan-400 font-semibold">{formatPrice(product.GIABAN)}</span>
                                <span className="text-white/40 text-xs">Kho: {product.TONKHO}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-white/40">
                    Không tìm thấy sản phẩm nào
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            {editingProduct ? "Chỉnh sửa sách" : "Thêm sách mới"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/60 mb-2">Tên sách *</label>
                                    <input
                                        type="text"
                                        value={formData.TENSACH}
                                        onChange={(e) => setFormData({ ...formData, TENSACH: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Tác giả *</label>
                                    <input
                                        type="text"
                                        value={formData.TACGIA}
                                        onChange={(e) => setFormData({ ...formData, TACGIA: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Nhà xuất bản *</label>
                                    <input
                                        type="text"
                                        value={formData.NXB}
                                        onChange={(e) => setFormData({ ...formData, NXB: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Giá bìa *</label>
                                    <input
                                        type="number"
                                        value={formData.GIABIA}
                                        onChange={(e) => setFormData({ ...formData, GIABIA: e.target.value })}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Giá bán *</label>
                                    <input
                                        type="number"
                                        value={formData.GIABAN}
                                        onChange={(e) => setFormData({ ...formData, GIABAN: e.target.value })}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Số trang *</label>
                                    <input
                                        type="number"
                                        value={formData.SOTRANG}
                                        onChange={(e) => setFormData({ ...formData, SOTRANG: e.target.value })}
                                        required
                                        min="1"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Tồn kho *</label>
                                    <input
                                        type="number"
                                        value={formData.TONKHO}
                                        onChange={(e) => setFormData({ ...formData, TONKHO: e.target.value })}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Danh mục</label>
                                    <select
                                        value={formData.CATEGORY}
                                        onChange={(e) => setFormData({ ...formData, CATEGORY: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.TENDANHMUC || cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/60 mb-2">URL hình ảnh</label>
                                    <input
                                        type="url"
                                        value={formData.IMG_CARD}
                                        onChange={(e) => setFormData({ ...formData, IMG_CARD: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-white/60 mb-2">Mô tả</label>
                                    <textarea
                                        value={formData.MOTA}
                                        onChange={(e) => setFormData({ ...formData, MOTA: e.target.value })}
                                        rows="3"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    {editingProduct ? "Cập nhật" : "Thêm sách"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
