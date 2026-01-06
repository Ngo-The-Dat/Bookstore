import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FULL_NAME: "",
        EMAIL: "",
        PASSWORD: "",
        confirmPassword: "",
        PHONE: "",
        DATE_OF_BIRTH: "",
        GENDER: "Nam",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value) => {
        setFormData((prev) => ({ ...prev, GENDER: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { FULL_NAME, EMAIL, PASSWORD, confirmPassword, PHONE, DATE_OF_BIRTH, GENDER } = formData;

        if (!FULL_NAME || !EMAIL || !PASSWORD || !PHONE || !DATE_OF_BIRTH) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (PASSWORD !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
            await axios.post(`${API_BASE}/auth/signup`, {
                FULL_NAME,
                EMAIL,
                PASSWORD,
                PHONE,
                DATE_OF_BIRTH,
                GENDER,
            });

            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            let msg = "Đăng ký thất bại. Vui lòng thử lại.";
            if (error.response) {
                msg = error.response.data.message || error.response.statusText;
            } else if (error.request) {
                msg = "Không thể kết nối đến server. Vui lòng kiểm tra lại.";
            } else {
                msg = error.message;
            }
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen relative bg-[#f9fafb]">
            {/* Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
                    backgroundSize: "32px 32px",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
                    maskImage:
                        "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
                }}
            />

            <Header />

            <main className="flex-grow flex items-center justify-center px-4 relative z-10 py-8">
                <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 text-center">
                        Đăng ký tài khoản
                    </h1>
                    <p className="text-sm text-slate-600 mb-6 text-center">
                        Tạo tài khoản để trải nghiệm mua sắm tốt hơn
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Họ tên */}
                        <div>
                            <label htmlFor="FULL_NAME" className="block text-sm font-medium text-slate-700 mb-1">
                                Họ và tên
                            </label>
                            <Input
                                id="FULL_NAME"
                                placeholder="Nguyễn Văn A"
                                value={formData.FULL_NAME}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="EMAIL" className="block text-sm font-medium text-slate-700 mb-1">
                                Email
                            </label>
                            <Input
                                id="EMAIL"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.EMAIL}
                                onChange={handleChange}
                            />
                        </div>

                        {/* SĐT & Giới tính */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="PHONE" className="block text-sm font-medium text-slate-700 mb-1">
                                    Số điện thoại
                                </label>
                                <Input
                                    id="PHONE"
                                    placeholder="0901234567"
                                    value={formData.PHONE}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Giới tính
                                </label>
                                <Select value={formData.GENDER} onValueChange={handleSelectChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn giới tính" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nam">Nam</SelectItem>
                                        <SelectItem value="Nữ">Nữ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Ngày sinh */}
                        <div>
                            <label htmlFor="DATE_OF_BIRTH" className="block text-sm font-medium text-slate-700 mb-1">
                                Ngày sinh
                            </label>
                            <Input
                                id="DATE_OF_BIRTH"
                                type="date"
                                value={formData.DATE_OF_BIRTH}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div>
                            <label htmlFor="PASSWORD" className="block text-sm font-medium text-slate-700 mb-1">
                                Mật khẩu
                            </label>
                            <Input
                                id="PASSWORD"
                                type="password"
                                placeholder="••••••••"
                                value={formData.PASSWORD}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                                Xác nhận mật khẩu
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-300"></div>
                        <span className="text-sm text-slate-500">hoặc</span>
                        <div className="flex-1 h-px bg-slate-300"></div>
                    </div>

                    {/* Google Login Button */}
                    <GoogleLoginButton label="Đăng ký với Google" />

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-primary hover:underline">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RegisterPage;
