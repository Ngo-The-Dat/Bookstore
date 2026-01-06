// Seed script to insert sample data for testing APIs
import { connectDB, delete_all_collection } from "../config/db.js";
import mongoose from "mongoose";
import userModel from "../models/user.js";
import addressModel from "../models/address.js";
import categoryModel from "../models/category.js";
import productModel from "../models/product.js";
import couponModel from "../models/coupon.js";
import cartModel from "../models/cart.js";
import reviewModel from "../models/review.js";
import userAuthModel from "../models/user_authentication.js";
import orderModel from "../models/order.js";

// Small helper to upsert by a key selector
async function upsertMany(models, items, keySelector) {
    const docs = [];
    for (const item of items) {
        const filter = keySelector(item);

        // 1. Tìm xem tài liệu đã tồn tại chưa
        let doc = await models.findOne(filter);

        if (doc) {
            // 2a. Nếu CÓ: Cập nhật các trường (giữ trạng thái modified của Mongoose)
            doc.set(item);
            const updated = await doc.save();
            docs.push(updated);
        } else {
            // 2b. Nếu KHÔNG CÓ: Tạo mới
            const newDoc = new models(item);
            const created = await newDoc.save();
            docs.push(created);
        }
    }
    return docs;
}

function daysFromNow(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
}

// Parse CLI flags like --orders=100 --products=30
function parseArgs() {
    const args = process.argv.slice(2);
    const out = {};
    for (const a of args) {
        if (a.startsWith("--")) {
            const eq = a.indexOf("=");
            if (eq > 2) {
                const key = a.slice(2, eq);
                const val = a.slice(eq + 1);
                out[key] = val;
            } else {
                out[a.slice(2)] = true;
            }
        }
    }
    return out;
}

async function seed({ refresh = false, productTarget = 20, orderTarget = 50 } = {}) {
    await connectDB();

    if (refresh) {
        console.log("\n[seed] Refresh mode: dropping all collections...");
        await delete_all_collection();
    }

    // 1) Categories
    const categoryData = [
        { NAME: "Tiểu thuyết" },
        { NAME: "Khoa học" },
        { NAME: "Kinh tế" },
        { NAME: "Thiếu nhi" },
        { NAME: "Lập trình" },
        { NAME: "Công nghệ thông tin" },
        { NAME: "Tâm lý" },
        { NAME: "Ngôn ngữ" },
        { NAME: "Lịch sử" },
        { NAME: "Truyện tranh" },
        { NAME: "Light novel" }
    ];

    const categories = await upsertMany(
        categoryModel,
        categoryData,
        (c) => ({ NAME: c.NAME })
    );
    const catByName = Object.fromEntries(categories.map((c) => [c.NAME, c]));

    // 2) Users
    const userData = [
        {
            FULL_NAME: "Nguyễn Văn A",
            GENDER: "Nam",
            EMAIL: "user1@example.com",
            PHONE: "0912345678",
            DATE_OF_BIRTH: new Date("1995-05-20"),
            ROLE: "customer",
            IS_ACTIVE: true,
        },
        {
            FULL_NAME: "Trần Thị B",
            GENDER: "Nữ",
            EMAIL: "user2@example.com",
            PHONE: "0987654321",
            DATE_OF_BIRTH: new Date("1998-09-10"),
            ROLE: "customer",
            IS_ACTIVE: true,
        },
        {
            FULL_NAME: "Lê Quốc Cường",
            GENDER: "Nam",
            EMAIL: "user3@example.com",
            PHONE: "0909123456",
            DATE_OF_BIRTH: new Date("1997-03-15"),
            ROLE: "admin",
            IS_ACTIVE: true,
        },
        {
            FULL_NAME: "Phạm Thùy Dung",
            GENDER: "Nữ",
            EMAIL: "user4@example.com",
            PHONE: "0938123456",
            DATE_OF_BIRTH: new Date("2000-12-05"),
            ROLE: "customer",
            IS_ACTIVE: false,
        },
        {
            FULL_NAME: "Đỗ Minh Khang",
            GENDER: "Nam",
            EMAIL: "user5@example.com",
            PHONE: "0978123456",
            DATE_OF_BIRTH: new Date("1996-09-30"),
            ROLE: "admin",
            IS_ACTIVE: true,
        }
    ];

    const users = await upsertMany(userModel, userData, (u) => ({ EMAIL: u.EMAIL }));
    const [user1, user2, user3, user4, user5] = users;

    // 3) Addresses
    const addressData = [
        // User 1
        { USER: user1._id, ADDRESS_LINE: "123 Lê Lợi, Q1, TP.HCM", IS_DEFAULT: true },
        { USER: user1._id, ADDRESS_LINE: "789 Nguyễn Huệ, Q1, TP.HCM", IS_DEFAULT: false },

        // User 2
        { USER: user2._id, ADDRESS_LINE: "456 Hai Bà Trưng, Q3, TP.HCM", IS_DEFAULT: true },
        { USER: user2._id, ADDRESS_LINE: "101 Đồng Khởi, Q1, TP.HCM", IS_DEFAULT: false },

        // User 3
        { USER: user3._id, ADDRESS_LINE: "12 Phạm Ngọc Thạch, Q3, TP.HCM", IS_DEFAULT: true },
        { USER: user3._id, ADDRESS_LINE: "34 Nguyễn Thị Minh Khai, Q1, TP.HCM", IS_DEFAULT: false },

        // User 4
        { USER: user4._id, ADDRESS_LINE: "56 Lý Tự Trọng, Q1, TP.HCM", IS_DEFAULT: true },
        { USER: user4._id, ADDRESS_LINE: "78 Trần Hưng Đạo, Q5, TP.HCM", IS_DEFAULT: false },

        // User 5
        { USER: user5._id, ADDRESS_LINE: "90 Bùi Thị Xuân, Q1, TP.HCM", IS_DEFAULT: true },
        { USER: user5._id, ADDRESS_LINE: "12 Nguyễn Văn Cừ, Q1, TP.HCM", IS_DEFAULT: false },
    ];

    await upsertMany(
        addressModel,
        addressData,
        (a) => ({ USER: a.USER, ADDRESS_LINE: a.ADDRESS_LINE })
    );

    // 4) Products (base list then auto-generate until productTarget)
    const randView = () => Math.floor(Math.random() * 1000); // 0-999
    const baseProducts = [
        {
            TITLE: "Về Chuyện Tôi Chuyển Sinh Thành Slime - Tập 7",
            LIST_PRICE: 215000,
            SALE_PRICE: 193500,
            DESCRIPTION: "Tác phẩm thiếu nhi kinh điển",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Tô Hoài",
            PUBLISHER: "NXB Kim Đồng",
            PAGE_COUNT: 200,
            STOCK: 50,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Light novel"]._id,
        },
        {
            TITLE: "Sapiens: Lược Sử Loài Người",
            LIST_PRICE: 250000,
            SALE_PRICE: 199000,
            DESCRIPTION: "Cuốn sách nổi tiếng về lịch sử nhân loại",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Yuval Noah Harari",
            PUBLISHER: "NXB Thế Giới",
            PAGE_COUNT: 520,
            STOCK: 80,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Khoa học"]._id,
        },
        {
            TITLE: "Tư Duy Nhanh Và Chậm",
            LIST_PRICE: 220000,
            SALE_PRICE: 175000,
            DESCRIPTION: "Kinh điển về tâm lý học nhận thức",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Daniel Kahneman",
            PUBLISHER: "NXB Lao Động",
            PAGE_COUNT: 600,
            STOCK: 40,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Kinh tế"]._id,
        },
        {
            TITLE: "Lập Trình C++ Cơ Bản",
            LIST_PRICE: 120000,
            SALE_PRICE: 100000,
            DESCRIPTION: "Học lập trình C++ từ cơ bản đến nâng cao",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Nguyễn Văn A",
            PUBLISHER: "NXB Trẻ",
            PAGE_COUNT: 350,
            STOCK: 50,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Lập trình"]._id,
        },
        {
            TITLE: "Học Python Dễ Dàng",
            LIST_PRICE: 150000,
            SALE_PRICE: 130000,
            DESCRIPTION: "Hướng dẫn Python cho người mới bắt đầu",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Trần Thị B",
            PUBLISHER: "NXB Giáo Dục",
            PAGE_COUNT: 400,
            STOCK: 80,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Lập trình"]._id,
        },
        {
            TITLE: "ReactJS Từ Cơ Bản đến Nâng Cao",
            LIST_PRICE: 200000,
            SALE_PRICE: 180000,
            DESCRIPTION: "Học lập trình front-end với ReactJS",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Lê Quốc Cường",
            PUBLISHER: "NXB Khoa Học",
            PAGE_COUNT: 500,
            STOCK: 30,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Công nghệ thông tin"]._id,
        },
        {
            TITLE: "Thuật Toán và Cấu Trúc Dữ Liệu",
            LIST_PRICE: 180000,
            SALE_PRICE: 160000,
            DESCRIPTION: "Tập trung vào thuật toán cơ bản và nâng cao",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Phạm Thùy Dung",
            PUBLISHER: "NXB Đại Học",
            PAGE_COUNT: 420,
            STOCK: 60,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Công nghệ thông tin"]._id,
        },
        {
            TITLE: "JavaScript Hiện Đại",
            LIST_PRICE: 160000,
            SALE_PRICE: 140000,
            DESCRIPTION: "Học JavaScript ES6+ và thực hành dự án web",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Đỗ Minh Khang",
            PUBLISHER: "NXB Trẻ",
            PAGE_COUNT: 380,
            STOCK: 45,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Công nghệ thông tin"]._id,
        },
        {
            TITLE: "Về Chuyện Tôi Chuyển Sinh Thành Slime - Tập 7",
            LIST_PRICE: 95000,
            SALE_PRICE: 80000,
            DESCRIPTION: "Tiểu thuyết triết lý nổi tiếng",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Paulo Coelho",
            PUBLISHER: "NXB Văn Học",
            PAGE_COUNT: 210,
            STOCK: 60,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Tiểu thuyết"]._id,
        },
        {
            TITLE: "Đắc Nhân Tâm",
            LIST_PRICE: 120000,
            SALE_PRICE: 100000,
            DESCRIPTION: "Kinh điển về nghệ thuật giao tiếp",
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: "Dale Carnegie",
            PUBLISHER: "NXB Lao Động",
            PAGE_COUNT: 320,
            STOCK: 70,
            VIEW_COUNT: randView(),
            CATEGORY: catByName["Tâm lý"]._id,
        }
    ];
    // Auto generate more until reaching productTarget
    const autoGenerated = [];
    const needMore = Math.max(0, productTarget - baseProducts.length);
    for (let i = 0; i < needMore; i++) {
        const idx = i + 1;
        autoGenerated.push({
            TITLE: `Sách Auto ${idx}`,
            LIST_PRICE: 100000 + (idx * 5000),
            SALE_PRICE: 90000 + (idx * 4000),
            DESCRIPTION: `Sách được tạo tự động #${idx}`,
            IMAGE_DETAIL: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            IMAGE_CARD: "1_card.jpg",
            AUTHOR: `Tác giả ${idx}`,
            PUBLISHER: "NXB Tự Động",
            PAGE_COUNT: 250 + idx,
            STOCK: 20 + idx,
            VIEW_COUNT: randView(),
            CATEGORY: categories[(idx % categories.length)]._id,
        });
    }

    const productPayload = [...baseProducts, ...autoGenerated];

    const products = await upsertMany(
        productModel,
        productPayload,
        (p) => ({ TITLE: p.TITLE })
    );
    // Keep direct references for readability
    const [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10] = products;

    // Map category -> product ids
    const catProductsMap = {};
    for (const p of products) {
        const catId = p.CATEGORY?.toString();
        if (!catId) continue;
        if (!catProductsMap[catId]) catProductsMap[catId] = [];
        catProductsMap[catId].push(p._id);
    }

    const bulkOps = Object.entries(catProductsMap).map(([catId, prodIds]) => ({
        updateOne: {
            filter: { _id: catId },
            update: { $set: { PRODUCTS: prodIds } }
        }
    }));

    if (bulkOps.length) {
        await categoryModel.bulkWrite(bulkOps);
    }

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
        {
            CODE: "WELCOME15",
            DISCOUNT_VALUE: 15,
            EXPIRY_DATE: daysFromNow(45),
            DISCOUNT_TYPE: "PERCENTAGE",
            USAGE_LIMIT: 50,
        },
        {
            CODE: "HOLIDAY100K",
            DISCOUNT_VALUE: 100000,
            EXPIRY_DATE: daysFromNow(90),
            DISCOUNT_TYPE: "FIXED_AMOUNT",
            USAGE_LIMIT: 30,
        },
        {
            CODE: "BLACKFRIDAY20",
            DISCOUNT_VALUE: 20,
            EXPIRY_DATE: daysFromNow(10),
            DISCOUNT_TYPE: "PERCENTAGE",
            USAGE_LIMIT: 200,
        },
        {
            CODE: "SUMMER50K",
            DISCOUNT_VALUE: 50000,
            EXPIRY_DATE: daysFromNow(120),
            DISCOUNT_TYPE: "FIXED_AMOUNT",
            USAGE_LIMIT: 80,
        },
        {
            CODE: "SPRING5",
            DISCOUNT_VALUE: 5,
            EXPIRY_DATE: daysFromNow(25),
            DISCOUNT_TYPE: "PERCENTAGE",
            USAGE_LIMIT: 100,
        }
    ];

    const coupons = await upsertMany(
        couponModel,
        couponData,
        (c) => ({ CODE: c.CODE })
    );
    const [coupon1] = coupons;

    // 6) Carts: create for all users with random items (ensure >=5 carts)
    const cartUsers = [user1, user2, user3, user4, user5];
    for (const u of cartUsers) {
        const itemCount = Math.min(4, Math.max(2, Math.floor(Math.random() * 5)));
        const used = new Set();
        const cartItems = [];
        while (cartItems.length < itemCount) {
            const prod = products[Math.floor(Math.random() * products.length)];
            if (used.has(prod._id.toString())) continue;
            used.add(prod._id.toString());
            cartItems.push({ PRODUCT: prod._id, QUANTITY: Math.floor(Math.random() * 3) + 1 });
        }
        await cartModel.findOneAndUpdate(
            { USER: u._id },
            { USER: u._id, CART_DETAIL: cartItems },
            { new: true, upsert: true }
        );
    }

    // 7) Reviews
    await upsertMany(
        reviewModel,
        [
            { USER: user1._id, PRODUCT: p1._id, RATING: 5, COMMENT: "Sách rất hay!" },
            { USER: user2._id, PRODUCT: p2._id, RATING: 4, COMMENT: "Đáng đọc" },
            { USER: user3._id, PRODUCT: p3._id, RATING: 4, COMMENT: "Nội dung bổ ích" },
            { USER: user4._id, PRODUCT: p4._id, RATING: 3, COMMENT: "Tạm ổn" },
            { USER: user5._id, PRODUCT: p5._id, RATING: 5, COMMENT: "Rất chi tiết" },
            { USER: user1._id, PRODUCT: p6._id, RATING: 5, COMMENT: "Thực hành tốt" },
            { USER: user2._id, PRODUCT: p7._id, RATING: 4, COMMENT: "Khó nhưng hay" },
        ],
        (r) => ({ USER: r.USER, PRODUCT: r.PRODUCT })
    );

    // 8) User authentication
    await upsertMany(
        userAuthModel,
        [
            { USER: user1._id, PROVIDER_NAME: "LOCAL", CREDENTIAL: "hashed:Test@1234" },
            { USER: user2._id, PROVIDER_NAME: "LOCAL", CREDENTIAL: "hashed:Aa@123456" },
            { USER: user3._id, PROVIDER_NAME: "LOCAL", CREDENTIAL: "hashed:Strong@123" },
            { USER: user4._id, PROVIDER_NAME: "LOCAL", CREDENTIAL: "hashed:Hello@2025" },
            { USER: user5._id, PROVIDER_NAME: "LOCAL", CREDENTIAL: "hashed:Admin@888" },
        ],
        (ua) => ({ USER: ua.USER, PROVIDER_NAME: ua.PROVIDER_NAME })
    );

    // 9) Generate multiple orders (configurable) with 2-5 items each across users
    const orderUsers = [user1, user2, user3, user4, user5];
    const allProducts = products;

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function buildOrderItems() {
        const itemCount = randomInt(2, 5); // 2-5 items
        const chosen = [];
        const used = new Set();
        while (chosen.length < itemCount) {
            const prod = allProducts[randomInt(0, allProducts.length - 1)];
            if (used.has(prod._id.toString())) continue; // avoid duplicate product in one order
            used.add(prod._id.toString());
            const qty = randomInt(1, 3);
            chosen.push({
                PRODUCT: prod._id,
                PRICE_AT_PURCHASE: prod.SALE_PRICE,
                QUANTITY: qty,
                TOTAL: prod.SALE_PRICE * qty,
            });
        }
        return chosen;
    }

    const orderDocs = [];
    for (let i = 0; i < orderTarget; i++) {
        const u = orderUsers[i % orderUsers.length];
        const itemsArr = buildOrderItems();
        const sub = itemsArr.reduce((s, it) => s + it.TOTAL, 0);
        const ship = randomInt(10000, 30000);
        const coupon = i % 3 === 0 ? coupon1 : null; // apply coupon1 every 3rd order
        let discount = 0;
        if (coupon) {
            discount = coupon.DISCOUNT_TYPE === "PERCENTAGE"
                ? Math.round((sub * coupon.DISCOUNT_VALUE) / 100)
                : coupon.DISCOUNT_VALUE;
        }
        const grand = Math.max(0, sub + ship - discount);
        const statusOptions = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];
        const paymentStatusOptions = ["PENDING", "PAID", "REFUNDED", "FAILED"]; // from schema
        const payMethodOptions = ["CASH", "BANK_TRANSFER", "E_WALLET", "PAYPAL", "OTHER"];

        orderDocs.push({
            USER: u._id,
            COUPON: coupon ? coupon._id : undefined,
            SHIPPING_ADDRESS: `Địa chỉ giao hàng #${i + 1}`,
            SUB_TOTAL: sub,
            SHIPPING_FEE: ship,
            DISCOUNT_AMOUNT: discount,
            GRAND_TOTAL: grand,
            STATUS: statusOptions[i % statusOptions.length],
            PAYMENT_METHOD: payMethodOptions[i % payMethodOptions.length],
            PAYMENT_STATUS: paymentStatusOptions[i % paymentStatusOptions.length],
            ITEM: itemsArr,
        });
    }

    // Insert or upsert orders: use a hash key (USER + GRAND_TOTAL + ITEM length) to avoid duplicates
    await Promise.all(
        orderDocs.map(async (ord) => {
            const filter = {
                USER: ord.USER,
                GRAND_TOTAL: ord.GRAND_TOTAL,
                SUB_TOTAL: ord.SUB_TOTAL,
                SHIPPING_ADDRESS: ord.SHIPPING_ADDRESS,
            };
            await orderModel.findOneAndUpdate(filter, { $set: ord }, { new: true, upsert: true });
        })
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
        orderModel.countDocuments(),
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
const parsed = parseArgs();
const refresh = parsed.refresh || parsed.r || false;
const productTarget = parsed.products ? parseInt(parsed.products, 10) : 20;
const orderTarget = parsed.orders ? parseInt(parsed.orders, 10) : 50;
seed({ refresh, productTarget, orderTarget })
    .catch((err) => {
        console.error("[seed] Error:", err);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close().catch(() => { });
    });
