import { get_all_products, add_product, delete_product, update_product, get_all_publishers, get_all_authors, get_product_by_id, get_filter_products, get_bestsellers, get_most_view_books, search_products } from '../controllers/productController.js';
import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();
//http://localhost:8000/products/get_all_products 
router.get('/get_all_products', get_all_products);
//http://localhost:8000/products/filter_product?TACGIA=Paulo Coelho&NXB=NXB Văn Học&minPrice=0&maxPrice=100000&sort=GIABAN&order=desc
router.get('/filter_product', get_filter_products);
//http://localhost:8000/products/add_product
router.post('/add_product', add_product);
//http://localhost:8000/products/detail?id=6933df24278af60d988e8cb6
router.get('/detail', get_product_by_id)
//http://localhost:8000/products/delete_product?id=6933df25278af60d988e8cbc
router.delete('/delete_product', delete_product);
//http://localhost:8000/products/update_product?id=6933df25278af60d988e8cbc
router.put('/update_product', update_product);
//http://localhost:8000/products/PUBLISHER 
router.get('/PUBLISHER', get_all_publishers);
//http://localhost:8000/products/AUTHOR 
router.get('/AUTHOR', get_all_authors)
//http://localhost:8000/products/best_seller 
router.get("/best_seller", get_bestsellers)
//http://localhost:8000/products/most_view_books 
router.get("/most_view_books", get_most_view_books)
//http://localhost:8000/products/search_products?name=V
router.get("/search_products", search_products)

export default router;