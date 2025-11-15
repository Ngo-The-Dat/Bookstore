import express from "express";
import { get_all_address, update_address } from "../controllers/addressController.js";

const router = express.Router()

router.get('/', get_all_address)
router.put('/:id', update_address);

export default router