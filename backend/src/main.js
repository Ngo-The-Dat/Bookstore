import { dotenv, express } from "./import.js"
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from "body-parser";

dotenv.config();

let port = process.env.PORT || 8000
const app = express()

// kết nối với database
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Tải web thành công: http://localhost:${port}/`)
    })
})

app.use(bodyParser.json())
// cho phép frontend kết nối với database
app.use(cors())
// app.use(cors({origin: ["http://localhost:8000", "http://localhost:8002"]}))
app.use(express.json())

// Sử dụng cookie parser để đọc cookie từ request
app.use(cookieParser());

const sanitizeRecursive = (obj) => {
    // Duyệt qua tất cả các key (khóa) trong đối tượng
    for (const key in obj) {
        // 1. Nếu key (khóa) bắt đầu bằng '$' (như $ne)
        if (key.startsWith('$')) {
            // Xoá nó đi
            delete obj[key];
        }
        // 2. Nếu giá trị (value) là một đối tượng khác
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            // "Đệ quy": Chạy lại hàm này cho đối tượng con
            sanitizeRecursive(obj[key]);
        }
    }
};

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) sanitizeRecursive(req.body);
    if (req.query) sanitizeRecursive(req.query);
    if (req.params) sanitizeRecursive(req.params);

    next();
};

app.use(sanitizeMiddleware);

import homeRoute from "./routes/homeRouters.js"
app.use("/home", homeRoute)

import authRoute from "./routes/authRoutes.js"
app.use("/auth", authRoute)

import userRoute from "./routes/userRoutes.js"
app.use("/users", userRoute)

import productRoute from "./routes/productRoutes.js"
app.use("/products", productRoute)

import addressRoute from "./routes/addressRoutes.js"
app.use('/addresses', addressRoute)

import reviewRoute from "./routes/reviewRoutes.js"
app.use('/reviews', reviewRoute)

import cartRoute from "./routes/cartRoutes.js"
app.use("/cart", cartRoute)

import orderRoute from "./routes/orderRoutes.js"
app.use("/orders", orderRoute)

import paymentRoute from "./routes/paymentRoutes.js"
app.use("/payments", paymentRoute)

import imageRoute from "./routes/imageRoutes.js"
app.use("/images", imageRoute)

import AIRoute from "./routes/AIRoutes.js"
app.use("/AI", AIRoute)

import categoryRoute from "./routes/categoryRoute.js"
app.use("/categories", categoryRoute)