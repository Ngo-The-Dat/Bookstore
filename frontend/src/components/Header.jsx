import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, Search, User, ShoppingCart, Bell, LogOut } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useCategories } from "@/hooks/useCategories";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { cartCount, fetchCart } = useCart();

  const { categories, loading: loadingCategories } = useCategories();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const res = await axiosClient.get("/users/get_current_user");
      if (res && res._id) {
        setUser(res);
        fetchCart();
      }
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
      setUser(null);
      toast.success("Đăng xuất thành công");
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error("Đăng xuất thất bại");
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const keyword = e.target.value.trim();
      if (keyword) {
        navigate(`/search?q=${encodeURIComponent(keyword)}`);
      }
      else {
        navigate(`/search`);
      }
    }
  };

  return (
    <header className="z-40 w-full bg-white/80 backdrop-blur-sm border-b sticky top-0">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="focus:outline-none focus:ring-0">
          <img
            src="https://via.placeholder.com/120x40.png?text=BookStore"
            alt="Logo"
            className="h-10 w-auto"
          />
        </Link>

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
            <PopoverContent className="w-56 p-2 max-h-96 overflow-y-auto">
              <nav className="flex flex-col gap-1">
                {loadingCategories ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Đang tải...</div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/category/${encodeURIComponent(category.NAME || "")}`}
                      className="px-3 py-2 text-sm rounded-md hover:bg-accent truncate"
                    >
                      {category.NAME}
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">Không có danh mục</div>
                )}
              </nav>
            </PopoverContent>
          </Popover>

          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 w-full"
              onKeyDown={handleSearch}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative">
            <Button variant="ghost" className="rounded-full" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Giỏ hàng</span>
            </Button>
          </Link>

          <Link to="/notifications">
            <Button variant="ghost" className="rounded-full" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Thông báo</span>
            </Button>
          </Link>

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
                  {user.FULL_NAME || user.EMAIL}
                </div>
                <Link to="/profile" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Hồ sơ
                  </Button>
                </Link>
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
