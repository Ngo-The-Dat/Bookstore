# Sơ lược về dự án Bookstore
Đây là trang web được xây dựng để quản lý cửa hàng sách trực tuyến, bao gồm các tính năng như quản lý sản phẩm, danh mục, người dùng, giỏ hàng, đơn hàng và đánh giá sản phẩm.

Công nghệ sử dụng cho trang web là MERN stack (MongoDB, Express.js, React.js, Node.js).

# Thành viên nhóm:
- Ngô Thế Đạt: Trưởng nhóm(PM), Backend Developer, Tester
- Nguyễn Trọng Tín: Backend Developer, Tester
- Lưu Ngô Quốc Bảo: Backend Developer, Tester
- Lê Thành Vinh: Frontend Developer
- Phạm Anh Hào: Frontend Developer, Tester
<br><br>
# Đóng góp thành viên
|Tên thành viên | Công việc |
|----------------|-----------|
|Ngô Thế Đạt | - Quản lý dự án. <br> - Thiết kế chức năng trang web <br> - Thiết kế và code cơ sở dữ liệu. <br> - Code API cho trang chủ, tìm kiếm, chi tiết sách. <br> - Viết báo cáo dự án, Kiểm thử|
|Nguyễn Trọng Tín | - Code API cho trang admin, đăng nhập, đăng ký. <br> - Code bảo mật JWT <br> - Viết báo cáo dự án, Kiểm thử|
|Lưu Ngô Quốc Bảo | - Code API cho trang giỏ hàng, thanh toán <br> - Thiết kế chức năng trang web <br> - Viết tài liệu dự án, Kiểm thử|
|Lê Thành Vinh | - Thiết kế giao diện người dùng <br> - Code frontend|
|Phạm Anh Hào | - Code frontend <br> - Kiểm thử|

<br>

# Hướng dẫn cài đặt và chạy dự án Bookstore

### 1. Cài đặt Node.js
- Tải Node.js tại: https://nodejs.org/en/download/

### 2. Cài node_modules:
Mở `terminal` hoặc `cmd` trong folder `frontend` và `backend`, chạy lệnh:
```bash
npm install
```

### 3. Tạo file environment:
Copy file `.env.example` thành `.env` trong cả folder `frontend` và `backend` và điền nội dụng phù hợp.

### 4. Seed dữ liệu test
Script seeder sẽ tạo dữ liệu mẫu cho trang web

### Chạy seed (không xóa dữ liệu hiện có, chỉ upsert):
```bash
npm run seed
```

Chạy seed làm mới (xóa toàn bộ collection trước khi tạo lại):
```bash
npm run seed:refresh
```

### Tạo tài khoản admin
Chỉnh sửa thông tin admin trong `src/seed/createAdmin.js` nếu cần.
Chạy lệnh sau để tạo tài khoản admin:
```bash
npm run seed:createAdmin
```

### 5. Cách compile:
Mở `terminal` hoặc `cmd` trong folder `backend` rồi đến `frontend`, chạy lệnh:
```bash 
npm run dev
```

### 6. Truy cập trang web:
Mở trình duyệt và truy cập vào địa chỉ ghi trong file `.env` của frontend. 

VD: `http://localhost:3000`