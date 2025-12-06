import express from 'express'
import { add_review, delete_a_review, get_a_book_average_rating, get_a_book_review, get_all_review, get_user_review, update_a_review } from '../controllers/reviewController.js'

const router = express.Router();

router.get('/', get_all_review);
router.post('/', add_review)
router.put('/:id', update_a_review)
router.delete('/:id', delete_a_review)
router.get('/product/:id', get_a_book_review)
router.get('/user/:id', get_user_review)
router.get('/average_rating/:id', get_a_book_average_rating)

export default router