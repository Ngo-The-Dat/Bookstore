import { get_all_products, add_product, delete_product, update_product, get_all_NXB, get_all_TACGIA, get_product_by_id, get_filter_products, get_bestsellers, get_most_view_books, search_products } from '../controllers/productController.js';
import express from 'express';
import { protect, restrictTo } from '../controllers/authMiddleware.js';

const router = express.Router();

router.get('/get_all_products', protect, restrictTo('admin'), get_all_products);
router.get('/filter_product', get_filter_products);
router.post('/add_product', protect, restrictTo('admin'), add_product);
router.delete('/delete_product/:id', protect, restrictTo('admin'), delete_product);
router.get('/:id', protect, restrictTo('admin'), get_product_by_id)
router.put('/update_product/:id', protect, restrictTo('admin'), update_product);
router.get('/NXB', protect, restrictTo('admin'), get_all_NXB);
router.get('/TACGIA', protect, restrictTo('admin'), get_all_TACGIA)
router.get("/best_seller", get_bestsellers)
router.get("/most_view_books", get_most_view_books)
router.get("/search_products", search_products)

export default router;