import express from 'express'
import { upload } from '../middlewares/multer.js'
import { delete_image, get_image, upload_images } from '../controllers/imageController.js'

const router = express.Router()

router.post('/', upload.array('image', 10), upload_images);
router.get('/', get_image)
router.delete('/', delete_image)

export default router