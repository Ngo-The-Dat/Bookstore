import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Vui lòng nhập đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      await authService.login(formData.email, formData.password);
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      const msg = error?.response?.data?.message || "Đăng nhập thất bại.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleChange,
    handleLogin
  };
};