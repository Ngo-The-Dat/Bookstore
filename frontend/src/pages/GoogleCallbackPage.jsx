import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const GoogleCallbackPage = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // The backend has already set the auth cookie during the OAuth callback
                // We just need to verify it worked by fetching the current user
                await authService.getCurrentUser();

                toast.success("Đăng nhập Google thành công!");
                navigate("/", { replace: true });
            } catch (error) {
                console.error("Google login callback error:", error);
                setStatus("error");
                toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");

                // Redirect to login page after a delay
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 2000);
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-slate-200">
                {status === "processing" ? (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">
                            Đang xử lý đăng nhập...
                        </h2>
                        <p className="text-slate-600">Vui lòng đợi trong giây lát</p>
                    </>
                ) : (
                    <>
                        <div className="text-red-500 text-5xl mb-4">✕</div>
                        <h2 className="text-xl font-semibold text-slate-800 mb-2">
                            Đăng nhập thất bại
                        </h2>
                        <p className="text-slate-600">Đang chuyển hướng về trang đăng nhập...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default GoogleCallbackPage;
