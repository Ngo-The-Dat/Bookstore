// Seed script to insert sample data for testing APIs
import { connectDB, delete_all_collection } from "../config/db.js";
import mongoose from "mongoose";
import userModel from "../model/user.js";
import addressModel from "../model/address.js";
import categoryModel from "../model/category.js";
import productModel from "../model/product.js";
import couponModel from "../model/coupon.js";
import cartModel from "../model/cart.js";
import reviewModel from "../model/review.js";
import userAuthModel from "../model/user_authentication.js";

// Small helper to upsert by a key selector
async function upsertMany(Model, items, keySelector) {
    const docs = [];
    for (const item of items) {
        const filter = keySelector(item);
        const updated = await Model.findOneAndUpdate(
            filter,
            { $set: item },
            { new: true, upsert: true }
        );
        docs.push(updated);
    }
    return docs;
}

function daysFromNow(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
}

async function seed({ refresh = false } = {}) {
    await connectDB();

    if (refresh) {
        console.log("\n[seed] Refresh mode: dropping all collections...");
        await delete_all_collection();
    }

    // 1) Categories
    const categoryData = [
        { TENDM: "Tiểu thuyết" },
        { TENDM: "Khoa học" },
        { TENDM: "Kinh tế" },
        { TENDM: "Thiếu nhi" }
    ];
    const categories = await upsertMany(
        categoryModel,
        categoryData,
        (c) => ({ TENDM: c.TENDM })
    );
    const catByName = Object.fromEntries(categories.map((c) => [c.TENDM, c]));

    // 2) Users
    const userData = [
        {
            HOTEN: "Nguyễn Văn A",
            PHAI: "Nam",
            EMAIL: "user1@example.com",
            PASSWORD: "Test@1234",
            SDT: "0912345678",
            NGAYSN: new Date("1995-05-20"),
            ROLE: "customer",
            IS_ACTIVE: true,
        },
        {
            HOTEN: "Trần Thị B",
            PHAI: "Nữ",
            EMAIL: "user2@example.com",
            PASSWORD: "Aa@123456",
            SDT: "0987654321",
            NGAYSN: new Date("1998-09-10"),
            ROLE: "customer",
            IS_ACTIVE: true,
        },
    ];
    const users = await upsertMany(userModel, userData, (u) => ({ EMAIL: u.EMAIL }));
    const [user1, user2] = users;

    // 3) Addresses
    const addressData = [
        { USER: user1._id, DIACHI: "123 Lê Lợi, Q1, TP.HCM", IS_DEFAULT: true },
        { USER: user2._id, DIACHI: "456 Hai Bà Trưng, Q3, TP.HCM", IS_DEFAULT: true },
    ];
    await upsertMany(
        addressModel,
        addressData,
        (a) => ({ USER: a.USER, DIACHI: a.DIACHI })
    );

    // 4) Products
    const productData = [
        {
            TENSACH: "Dế Mèn Phiêu Lưu Ký",
            GIABIA: 90000,
            GIABAN: 75000,
            MOTA: "Tác phẩm thiếu nhi kinh điển",
            IMG_URL: "https://picsum.photos/seed/book1/400/600",
            TACGIA: "Tô Hoài",
            NXB: "NXB Kim Đồng",
            SOTRANG: 200,
            TONKHO: 50,
            CATEGORY: catByName["Thiếu nhi"]._id,
        },
        {
            TENSACH: "Sapiens: Lược Sử Loài Người",
            GIABIA: 250000,
            GIABAN: 199000,
            MOTA: "Cuốn sách nổi tiếng về lịch sử nhân loại",
            IMG_URL: "https://picsum.photos/seed/book2/400/600",
            TACGIA: "Yuval Noah Harari",
            NXB: "NXB Thế Giới",
            SOTRANG: 520,
            TONKHO: 80,
            CATEGORY: catByName["Khoa học"]._id,
        },
        {
            TENSACH: "Tư Duy Nhanh Và Chậm",
            GIABIA: 220000,
            GIABAN: 175000,
            MOTA: "Kinh điển về tâm lý học nhận thức",
            IMG_URL: "https://picsum.photos/seed/book3/400/600",
            TACGIA: "Daniel Kahneman",
            NXB: "NXB Lao Động",
            SOTRANG: 600,
            TONKHO: 40,
            CATEGORY: catByName["Kinh tế"]._id,
        },
    ];
    const products = await upsertMany(
        productModel,
        productData,
        (p) => ({ TENSACH: p.TENSACH })
    );
    const [p1, p2, p3] = products;

    // 5) Coupons
    const couponData = [
        {
            CODE: "SALE10",
            DISCOUNT_VALUE: 10,
            EXPIRY_DATE: daysFromNow(30),
            DISCOUNT_TYPE: "PERCENTAGE",
            USAGE_LIMIT: 100,
        },
        {
            CODE: "SAVE50K",
            DISCOUNT_VALUE: 50000,
            EXPIRY_DATE: daysFromNow(60),
            DISCOUNT_TYPE: "FIXED_AMOUNT",
            USAGE_LIMIT: 100,
        },
    ];
    const coupons = await upsertMany(
        couponModel,
        couponData,
        (c) => ({ CODE: c.CODE })
    );
    const [coupon1] = coupons;

    // 6) Cart for user1
    await cartModel.findOneAndUpdate(
        { USER: user1._id },
        {
            USER: user1._id,
            CART_DETAIL: [
                { PRODUCT: p1._id, QUANTITY: 1 },
                { PRODUCT: p2._id, QUANTITY: 2 },
            ],
        },
        { new: true, upsert: true }
    );

    // 7) Reviews
    await upsertMany(
        reviewModel,
        [
            { USER: user1._id, PRODUCT: p1._id, RATING: 5, COMMENT: "Sách rất hay!" },
            { USER: user2._id, PRODUCT: p2._id, RATING: 4, COMMENT: "Đáng đọc" },
        ],
        (r) => ({ USER: r.USER, PRODUCT: r.PRODUCT })
    );

    // 8) User authentication
    await upsertMany(
        userAuthModel,
        [
            { USER: user1._id, PROVIDER_NAME: "LOCAL", CREDENTIAL: "hashed:Test@1234" },
            { USER: user2._id, PROVIDER_NAME: "LOCAL", CREDENTIAL: "hashed:Aa@123456" },
        ],
        (ua) => ({ USER: ua.USER, PROVIDER_NAME: ua.PROVIDER_NAME })
    );

    // 9) A sample order for user1
    const items = [
        {
            PRODUCT: p2._id,
            NAME: p2.TENSACH,
            PRICE_AT_PURCHASE: p2.GIABAN,
            QUANTITY: 1,
            TOTAL: p2.GIABAN * 1,
        },
        {
            PRODUCT: p3._id,
            NAME: p3.TENSACH,
            PRICE_AT_PURCHASE: p3.GIABAN,
            QUANTITY: 2,
            TOTAL: p3.GIABAN * 2,
        },
    ];
    const subTotal = items.reduce((s, it) => s + it.TOTAL, 0);
    const shippingFee = 15000;
    const discountAmount = coupon1.DISCOUNT_TYPE === "PERCENTAGE"
        ? Math.round((subTotal * coupon1.DISCOUNT_VALUE) / 100)
        : coupon1.DISCOUNT_VALUE;
    const grandTotal = Math.max(0, subTotal + shippingFee - discountAmount);

    await mongoose.model("order").findOneAndUpdate(
        { USER: user1._id, GRAND_TOTAL: grandTotal },
        {
            USER: user1._id,
            COUPON: coupon1._id,
            SHIPPING_ADDRESS: "123 Lê Lợi, Q1, TP.HCM",
            SUB_TOTAL: subTotal,
            SHIPPING_FEE: shippingFee,
            DISCOUNT_AMOUNT: discountAmount,
            GRAND_TOTAL: grandTotal,
            STATUS: "CONFIRMED",
            PAYMENT_METHOD: "CASH",
            PAYMENT_STATUS: "PAID",
            ITEM: items,
        },
        { new: true, upsert: true }
    );

    // Summary
    const counts = await Promise.all([
        userModel.countDocuments(),
        addressModel.countDocuments(),
        categoryModel.countDocuments(),
        productModel.countDocuments(),
        couponModel.countDocuments(),
        cartModel.countDocuments(),
        reviewModel.countDocuments(),
        mongoose.model("order").countDocuments(),
        userAuthModel.countDocuments(),
    ]);

    console.log("\n[seed] Done.");
    console.table([
        { collection: "users", count: counts[0] },
        { collection: "addresses", count: counts[1] },
        { collection: "categories", count: counts[2] },
        { collection: "products", count: counts[3] },
        { collection: "coupons", count: counts[4] },
        { collection: "carts", count: counts[5] },
        { collection: "reviews", count: counts[6] },
        { collection: "orders", count: counts[7] },
        { collection: "user_authentications", count: counts[8] },
    ]);
}

// Entry
const refresh = process.argv.includes("--refresh") || process.argv.includes("-r");
seed({ refresh })
    .catch((err) => {
        console.error("[seed] Error:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close().catch(() => { });
    });
