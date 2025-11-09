import { express } from "../import.js";
import { add_document, update_a_document, delete_document, get_all_documents, update_category } from "../controllers/taskControllers.js";
const router = express.Router()

router.get("/:collection_name", get_all_documents)
router.post("/:collection_name", add_document)
router.put("/:collection_name/:id", update_a_document)
router.delete("/:collection_name/:id", delete_document)

export default router;