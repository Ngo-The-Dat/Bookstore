// src/types/product.types.ts

// 1. Định nghĩa kiểu dữ liệu trả về từ API Backend cũ
export type Book = {
  _id: string;
  TENSACH: string;
  GIABIA: number;      // Giá gốc (để gạch đi)
  GIABAN: number;      // Giá bán thực tế
  MOTA: string;
  IMG_DETAIL: string[]; // Mảng tên file ảnh chi tiết
  IMG_CARD: string;     // Tên file ảnh đại diện
  TACGIA: string;
  NXB: string;
  SOTRANG: number;
  TONKHO: number;
  VIEWCOUNT: number;
  CATEGORY: string;     // ID danh mục
  CREATED_AT: string;
  __v?: number;
};

// 2. Kiểu dữ liệu dùng cho UI Shopco (Giữ nguyên gốc + mở rộng thêm optional)
export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: string;          // Shopco gốc dùng number, nhưng MongoDB trả string nên ta dùng string
  title: string;
  srcUrl: string;      // Tương ứng IMG_CARD
  gallery?: string[];  // Tương ứng IMG_DETAIL
  price: number;       // Tương ứng GIABAN
  discount: Discount;  // Tính toán từ GIABIA và GIABAN
  rating: number;      // Mặc định hoặc lấy từ API review riêng
  
  // Các trường bổ sung cho Sách (để dùng ở trang chi tiết)
  description?: string; // MOTA
  author?: string;      // TACGIA
  publisher?: string;   // NXB
  stock?: number;       // TONKHO
};