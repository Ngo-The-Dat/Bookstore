import express from 'express'
import { upload } from '../middlewares/multer.js'
import { delete_image, get_image, upload_image } from '../controllers/imageController.js'

const router = express.Router()

router.post('/', upload.single('image'), upload_image);
router.get('/', get_image)
router.delete('/', delete_image)

export default router