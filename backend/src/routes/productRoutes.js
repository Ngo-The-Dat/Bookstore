import { get_all_products, add_product, delete_product, update_product, get_all_NXB, get_all_TACGIA, get_product_by_id, get_filter_products, get_bestsellers, get_most_view_books, search_products } from '../controllers/productController.js';
import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

router.get('/get_all_products', get_all_products);
router.get('/filter_product', get_filter_products);
router.post('/add_product', add_product);
router.get('/detail', get_product_by_id)
router.delete('/delete_product', delete_product);
router.put('/update_product', update_product);
router.get('/NXB', get_all_NXB);
router.get('/TACGIA', get_all_TACGIA)
router.get("/best_seller", get_bestsellers)
router.get("/most_view_books", get_most_view_books)
router.get("/search_products", search_products)

export default router;