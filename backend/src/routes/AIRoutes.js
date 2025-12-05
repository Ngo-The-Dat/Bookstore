import express from 'express'
import { converse } from '../controllers/AIController.js'

const router = express.Router()

router.post('/converse', converse)

export default router
