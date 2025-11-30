// src/lib/image-resolver.ts
import api from "@/lib/axios";

// Hàm helper để giải mã response ảnh phức tạp của backend
const extractUrl = (data: any, name: string): string | null => {
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data[0];
  if (typeof data === "object" && data !== null) {
    return (
      data[name] ||
      data.url ||
      (Array.isArray(data.urls) && data.urls[0]) ||
      Object.values(data).find(
        (v) => typeof v === "string" && (v.startsWith("http") || v.startsWith("/"))
      ) || null
    );
  }
  return null;
};

// Hàm gọi API để lấy URL thật từ mảng tên file
export const resolveRealImageUrls = async (imageNames: string[]): Promise<string[]> => {
  if (!imageNames || imageNames.length === 0) return [];

  const urls: string[] = [];
  
  // Backend có vẻ hỗ trợ gọi 1 lần 1 tên, hoặc list. 
  // Để an toàn, ta dùng Promise.all để gọi song song nếu API chỉ nhận từng cái.
  // Tuy nhiên, dựa trên BookDetail.jsx cũ, ta loop qua từng tên.
  
  const promises = imageNames.map(async (name) => {
    try {
      // Bỏ qua nếu đã là link
      if(name.startsWith('http')) return name;

      const res = await api.get("/images/urls", { params: { names: name } });
      const url = extractUrl(res.data, name);
      return url || "/images/placeholder.png";
    } catch (e) {
      console.error(`Error resolving image ${name}`, e);
      return "/images/placeholder.png";
    }
  });

  return await Promise.all(promises);
};