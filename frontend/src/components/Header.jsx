import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, Search, User, ShoppingCart, Bell, LogOut } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users/get_current_user`, {
        withCredentials: true,
      });
      if (res.data && res.data._id) {
        setUser(res.data);
        fetchCartCount();
      }
    } catch (error) {
      // Not logged in
      setUser(null);
      setCartCount(0);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get(`${API_BASE}/cart`, {
        withCredentials: true,
      });
      if (res.data && res.data.CART_DETAIL) {
        const count = res.data.CART_DETAIL.reduce(
          (acc, item) => acc + item.QUANTITY,
          0
        );
        setCartCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch cart count", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setCartCount(0);
      toast.success("Đăng xuất thành công");
      navigate("/");
    } catch (error) {
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <header className="z-40 w-full bg-white/80 backdrop-blur-sm border-b sticky top-0">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="focus:outline-none focus:ring-0">
          <img
            src="https://via.placeholder.com/120x40.png?text=BookStore"
            alt="Logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Phần giữa: Danh mục và Searchbar */}
        <div className="flex items-center gap-6 flex-1 max-w-3xl mx-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-transparent focus:bg-transparent text-gray-600 hover:text-primary hidden md:flex"
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

          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 w-full"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Các nút bên phải: Giỏ hàng, Thông báo, Tài khoản */}
        <div className="flex items-center gap-2">
          {/* NÚT MỚI: Giỏ hàng */}
          <Link to="/cart" className="relative">
            <Button variant="ghost" className="rounded-full" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Giỏ hàng</span>
            </Button>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* NÚT MỚI: Thông báo */}
          <Link to="/notifications">
            <Button variant="ghost" className="rounded-full" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Thông báo</span>
            </Button>
          </Link>

          {/* Nút Tài khoản */}
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="rounded-full" size="icon">
                  <User className="h-5 w-5 text-primary" />
                  <span className="sr-only">Tài khoản</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <div className="px-2 py-1.5 text-sm font-semibold border-b mb-1">
                  {user.HOTEN || user.EMAIL}
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="rounded-full" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Đăng nhập</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

