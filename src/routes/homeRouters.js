import { express } from "../import.js";
import { add_category, delete_category, get_all_categories, get_all_task, update_category } from "../controllers/taskControllers.js";
const router = express.Router()

router.get("/", get_all_categories)
router.post("/", add_category)
router.put("/:id", update_category)
router.delete("/:id", delete_category)

export default router;