import { express } from "../import.js";
import { add_category, delete_category, get_all_categories, get_all_products, update_category } from "../controllers/taskControllers.js";
const router = express.Router()

router.get("/categories", get_all_categories)
router.post("/category", add_category)
router.put("/category/:id", update_category)
router.delete("/category/:id", delete_category)

router.get("/products", get_all_products)

export default router;