import express from 'express'
import { upload } from '../middlewares/multer.js'
import { delete_image, get_image, get_image_url, list_images_name, upload_images } from '../controllers/imageController.js'

const router = express.Router()

router.post('/', upload.array('image', 10), upload_images);
router.get('/', get_image)
router.delete('/', delete_image)
router.get('/list', list_images_name)
router.get('/url', get_image_url)

export default router