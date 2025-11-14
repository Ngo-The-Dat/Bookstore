import React from "react";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-[#f9fafb] text-slate-300 py-12 z-40 w-full backdrop-blur-sm border-b">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {/* Column 1: Về Bookstore */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Về Bookstore
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-slate-600 hover:text-white transition-colors">Giới thiệu Bookstore</Link></li>
            <li><Link to="/store-system" className="text-slate-600 hover:text-white transition-colors">Hệ thống nhà sách</Link></li>
            <li><Link to="/terms" className="text-slate-600 hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
            <li><Link to="/privacy" className="text-slate-600 hover:text-white transition-colors">Chính sách bảo mật</Link></li>
          </ul>
        </div>

        {/* Column 2: Hỗ trợ khách hàng */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="text-slate-600 hover:text-white transition-colors">Các câu hỏi thường gặp</Link></li>
            <li><Link to="/returns" className="text-slate-600 hover:text-white transition-colors">Chính sách đổi trả</Link></li>
            <li><Link to="/shipping" className="text-slate-600 hover:text-white transition-colors">Phương thức vận chuyển</Link></li>
            <li><Link to="/payment" className="text-slate-600 hover:text-white transition-colors">Phương thức thanh toán</Link></li>
          </ul>
        </div>

        {/* Column 3: Liên hệ */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 text-white uppercase tracking-wider">
            Liên hệ
          </h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>Hotline: 1900 123 456</p>
            <p>Email: support@bookstore.com</p>
          </div>
        </div>

        {/* Column 4: Đăng ký nhận tin */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Đăng ký nhận tin
          </h3>
          <p className="text-sm text-slate-600">
            Nhận thông tin khuyến mãi và sách mới nhất.
          </p>
          <form className="flex items-center">
            <Input
              type="email"
              placeholder="Email của bạn"
              className="bg-white text-slate-900 border-slate-300 rounded-r-none focus:ring-primary focus:border-primary"
            />
            <Button
              type="submit"
              variant="destructive"
              className="rounded-l-none"
            >
              Gửi
            </Button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;