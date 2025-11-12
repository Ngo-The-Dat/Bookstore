### Cài đặt Node.js
- Tải Node.js tại: https://nodejs.org/en/download/

### Cài node_modules:
```bash
npm install
```

### Cách compile:
```bash 
npm run dev
```
Tự động reload khi lưu file.

### Seed dữ liệu test
Script seeder sẽ tạo user, product, category, coupon, cart, review và 1 đơn hàng mẫu.

Chạy seed (không xóa dữ liệu hiện có, chỉ upsert):
```bash
npm run seed
```

Chạy seed làm mới (xóa toàn bộ collection trước khi tạo lại):
```bash
npm run seed:refresh
```

Tùy chọn cờ trực tiếp nếu muốn:
```bash
node src/seed/seed.js --refresh
```

### Tạo tài khoản admin
Chỉnh sửa thông tin admin trong `src/seed/createAdmin.js` nếu cần.
Chạy lệnh sau để tạo tài khoản admin:
```bash
npm run seed:createAdmin
```

### Biến môi trường cần thiết
Tạo file `.env` với biến kết nối MongoDB:
```
URL_MONGODB=mongodb://localhost:27017/bookstore
```

### Dọn dẹp thủ công CSDL
Nếu muốn xóa tay toàn bộ collection mà không seed lại:
```bash
"scripts": {
    "dev": "nodemon app.js"
  }