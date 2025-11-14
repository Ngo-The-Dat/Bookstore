import { express } from "../import.js";
import { add_document, update_a_document, delete_document, get_all_documents, get_bestsellers, get_most_view_books, search_products } from "../controllers/taskControllers.js";
const router = express.Router()

router.get("/best_seller", get_bestsellers)
router.get("/most_view_books", get_most_view_books)
router.get("/search_products", search_products) // URL mẫu: http://localhost:8000/home/search_products?name=Học
router.get("/:collection_name", get_all_documents)
router.post("/:collection_name", add_document)
router.put("/:collection_name/:id", update_a_document)
router.delete("/:collection_name/:id", delete_document)

export default router;