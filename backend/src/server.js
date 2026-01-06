import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import sanitize from "mongo-sanitize"

dotenv.config();

let port = process.env.PORT || 8000
const app = express()

// kết nối với database
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Tải web thành công: http://localhost:${port}/`)
    })
})

// cho phép frontend kết nối với database
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
// app.use(cors({origin: ["http://localhost:8000", "http://localhost:8002"]}))
app.use(express.json())

// Sử dụng cookie parser để đọc cookie từ request
app.use(cookieParser());

// Lọc dữ liệu đầu vào để ngăn chặn tấn công NoSQL Injection
app.use((req, res, next) => {
    // Lọc dữ liệu trong body
    req.body = sanitize(req.body);

    // Lọc dữ liệu trong query
    if (req.query) {
        const cleanQuery = sanitize(req.query);
        // Xóa hết key cũ trong req.query
        for (const key in req.query) {
            delete req.query[key];
        }
        // Copy key từ cleanQuery bỏ vào lại req.query
        Object.assign(req.query, cleanQuery);
    }

    // Lọc dữ liệu trong params
    if (req.params) {
        const cleanParams = sanitize(req.params);
        // Xóa hết key cũ trong req.params
        for (const key in req.params) {
            delete req.params[key];
        }
        // Copy key từ cleanParams bỏ vào lại req.params
        Object.assign(req.params, cleanParams);
    }

    next();
});

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
