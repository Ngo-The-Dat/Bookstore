import express from "express"
import {get_all_categories} from "../controllers/categoryController.js"

const router = express.Router()

router.get("/", get_all_categories)

export default router