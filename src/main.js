import { mongoose, dotenv, express, user, address, product, category, coupon, order, order_details, cart, cart_details, review } from "./import.js"
import homeRoute from "./routes/homeRouters.js"
import { connectDB, delete_all_collection } from "./config/db.js";

dotenv.config();

let port = process.env.PORT
const app = express(port)

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Tải web thành công: http://localhost:${port}/`)
    })
})

app.use(express.json())
app.use("/home", homeRoute)