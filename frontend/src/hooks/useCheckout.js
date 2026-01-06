import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { orderService } from "@/services/orderService";
import { authService } from "@/services/authService";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export const useCheckout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "CASH",
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setFormData(prev => ({
            ...prev,
            fullName: user.FULL_NAME || "",
            phone: user.PHONE || ""
          }));
        }
      } catch (error) {
        // Ignore error if user info can't be loaded (maybe guest checkout or token expired)
      }
    };
    loadUserInfo();
  }, []);

  const shippingFee = 30000;
  const finalTotal = cartTotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setPaymentMethod = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        shippingAddress: `${formData.address}, ${formData.city}`,
        paymentMethod: formData.paymentMethod,
      };

      await orderService.createOrder(orderData);
      toast.success("Đặt hàng thành công!");
      await clearCart();
      navigate("/");
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    cart,
    cartTotal,
    shippingFee,
    finalTotal,
    formData,
    isProcessing,
    handleInputChange,
    setPaymentMethod,
    handleSubmit
  };
};
