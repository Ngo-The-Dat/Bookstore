// src/lib/mapper.ts
import { Book, Product } from "@/types/product.types";

export const mapBookToProduct = (book: Book): Product => {
  // Tính phần trăm giảm giá
  // Ví dụ: Giá bìa 95k, Giá bán 80k -> Giảm (15/95)*100 = ~15.7% -> Làm tròn 16%
  let discountPercentage = 0;
  if (book.GIABIA > book.GIABAN && book.GIABIA > 0) {
    discountPercentage = Math.round(((book.GIABIA - book.GIABAN) / book.GIABIA) * 100);
  }

  return {
    id: book._id, // Map _id của Mongo sang id của Shopco
    title: book.TENSACH,
    
    // Lưu ý: Đây chỉ là tên file ảnh (vd: "1_card.jpg"), 
    // Component AsyncImage (đã tạo ở bước trước) sẽ lo việc fetch URL thật.
    srcUrl: book.IMG_CARD || "", 
    
    gallery: book.IMG_DETAIL || [],
    
    // Shopco hiển thị "price" là giá cuối cùng khách phải trả
    price: book.GIABAN, 
    
    discount: {
      amount: 0,
      percentage: discountPercentage, 
    },
    
    // API sách hiện tại chưa trả về RATING trung bình trong object này
    // Tạm thời để 0 hoặc 5, hoặc random cho đẹp demo
    rating: 4.5, 

    // Map thêm các trường phụ để dùng ở trang chi tiết
    description: book.MOTA,
    author: book.TACGIA,
    publisher: book.NXB,
    stock: book.TONKHO,
  };
};