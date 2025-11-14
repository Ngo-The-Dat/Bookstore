import React from "react";
import { Link } from "react-router";
import { Menu, Search, User, ShoppingCart, Bell } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Dữ liệu mẫu cho danh mục
const categories = [
  "Văn Học",
  "Kinh Tế",
  "Tâm Lý - Kỹ Năng Sống",
  "Sách Thiếu Nhi",
  "Tiểu Thuyết",
  "Sách Nước Ngoài",
];

const Header = () => {
  return (
    <header className="z-40 w-full bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="focus:outline-none focus:ring-0">
          <img
            src="https://via.placeholder.com/120x40.png?text=YourLogo"
            alt="Logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Phần giữa: Danh mục và Searchbar */}
        <div className="flex items-center gap-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-transparent focus:bg-transparent text-gray-600 hover:text-primary"
              >
                <Menu className="h-5 w-5 mr-2" />
                <span className="font-medium">Danh mục</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <nav className="flex flex-col gap-1">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category}`}
                    className="px-3 py-2 text-sm rounded-md hover:bg-accent"
                  >
                    {category}
                  </Link>
                ))}
              </nav>
            </PopoverContent>
          </Popover>

          <div className="relative w-full max-w-lg">
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Các nút bên phải: Giỏ hàng, Thông báo, Tài khoản */}
        <div className="flex items-center gap-2">
          {/* NÚT MỚI: Giỏ hàng */}
          <Link to="/cart">
            <Button variant="ghost" className="rounded-full" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Giỏ hàng</span>
            </Button>
          </Link>

          {/* NÚT MỚI: Thông báo */}
          <Link to="/notifications">
            <Button variant="ghost" className="rounded-full" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Thông báo</span>
            </Button>
          </Link>
          
          {/* Nút Tài khoản */}
          <Link to="/account">
            <Button variant="ghost" className="rounded-full" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Tài khoản</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;