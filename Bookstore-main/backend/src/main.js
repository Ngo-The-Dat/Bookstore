import { mongoose, dotenv, express, user, address, product, category, coupon, order, cart, review } from "./import.js"
import homeRoute from "./routes/homeRouters.js"
import { connectDB, delete_all_collection } from "./config/db.js";
import cors from "cors"

dotenv.config();

let port = process.env.PORT
const app = express(port)

// kết nối với database
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Tải web thành công: http://localhost:${port}/`)
    })
})

// cho phép frontend kết nối với database
app.use(cors())
// app.use(cors({origin: ["http://localhost:8000", "http://localhost:8002"]}))
app.use(express.json())
app.use("/home", homeRoute)