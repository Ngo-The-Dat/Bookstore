import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen } from "lucide-react";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchCategoryProducts();
    }, [categoryName]);

    useEffect(() => {
        // Paginate products
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setProducts(allProducts.slice(startIndex, endIndex));
    }, [currentPage, allProducts]);

    const fetchCategoryProducts = async () => {
        setLoading(true);
        setCurrentPage(1);
        try {
            // Fetch category by name
            const cat = await categoryService.getByName(decodeURIComponent(categoryName));
            setCategory(cat);

            if (cat && cat._id) {
                // Fetch all products and filter by category
                const allProds = await productService.getAll();
                const prodList = Array.isArray(allProds) ? allProds : [];

                // Filter products by category ID
                const filteredProducts = prodList.filter(
                    (p) => p.CATEGORY === cat._id || p.CATEGORY?._id === cat._id
                );

                setAllProducts(filteredProducts);
                setProducts(filteredProducts.slice(0, ITEMS_PER_PAGE));
            } else {
                setAllProducts([]);
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching category products:", error);
            setAllProducts([]);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) items.push(<PaginationEllipsis key="ellipsis-start" />);
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={currentPage === i}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) items.push(<PaginationEllipsis key="ellipsis-end" />);
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f9fafb]">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/">
                        <Button variant="ghost" className="pl-0 text-gray-600 hover:text-primary">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Quay lại trang chủ
                        </Button>
                    </Link>
                </div>

                {/* Category Header */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                            <BookOpen className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {decodeURIComponent(categoryName)}
                            </h1>
                            <p className="text-gray-600">
                                {loading ? "Đang tải..." : `${allProducts.length} sản phẩm`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex flex-col min-h-[600px]">
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <Skeleton height={200} />
                                        <Skeleton count={2} />
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((book) => (
                                    <BookCard key={book._id} book={book} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg shadow-sm">
                                <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                                    Không tìm thấy sản phẩm
                                </h2>
                                <p className="text-gray-500 mb-4">
                                    Danh mục "{decodeURIComponent(categoryName)}" chưa có sản phẩm nào
                                </p>
                                <Link to="/search">
                                    <Button>Khám phá sách khác</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-8 py-4 border-t">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {renderPaginationItems()}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CategoryPage;
