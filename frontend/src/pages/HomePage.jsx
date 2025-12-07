import React from "react";
import Header from "@/components/Header"; 
import PromotionBanner from "@/components/PromotionBanner";
import BookCarousel from "@/components/BookCarousel";
import Footer from "@/components/Footer";
import { useHomeData } from "@/hooks/useHomeData";

const HomePage = () => {
  const { bestSellers, newArrivals } = useHomeData();

  return (
    <div className="flex flex-col h-screen relative bg-[#f9fafb] overflow-y-auto scrollbar-hide">
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
      
      <main className="flex-grow overflow-y-auto bg-transparent overscroll-y-contain scrollbar-hide">
        <div className="container mx-auto px-4 relative z-10 pt-8">
          <PromotionBanner />
          
          <BookCarousel title="Sách Bán Chạy" books={bestSellers} />
          
          <BookCarousel title="Sách Mới Phát Hành" books={newArrivals} />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default HomePage;