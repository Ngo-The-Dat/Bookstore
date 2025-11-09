### Chạy server (dev)
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

### Biến môi trường cần thiết
Tạo file `.env` với biến kết nối MongoDB:
```
URL_MONGODB=mongodb://localhost:27017/bookstore
```

### Dọn dẹp thủ công CSDL
Nếu muốn xóa tay toàn bộ collection mà không seed lại:
```bash
node -e "import('./src/config/db.js').then(m=>m.connectDB().then(()=>m.delete_all_collection().then(()=>process.exit())))"
```

### Ghi chú
Seeder dùng upsert để idempotent – chạy nhiều lần không tạo bản ghi trùng khóa (dựa trên EMAIL, CODE, TENSACH...).
Muốn thêm dữ liệu khác, sửa file `src/seed/seed.js`.

