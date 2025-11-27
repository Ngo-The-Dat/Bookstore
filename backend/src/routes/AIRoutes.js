import express from 'express'
import { converse, embedding_text } from '../controllers/AIController.js'

const router = express.Router()

router.post('/converse', converse)
router.post('/embedding', embedding_text)

export default router
