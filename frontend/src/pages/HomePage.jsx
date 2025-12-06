import React, { useEffect } from "react";
import Header from "@/components/Header"; 
import PromotionBanner from "@/components/PromotionBanner";
import BookCard from "@/components/BookCard";
import BookCarousel from "@/components/BookCarousel";
import Footer from "@/components/Footer";
import  {useState} from "react";
import { toast } from "sonner";
import axios from "axios";


const HomePage = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;

      const resBestSeller  = await axios.get(`${API}/products/get_all_products`);
      setBestSellers(resBestSeller.data);
      console.log(resBestSeller.data);

      const resNewArrivals = await axios.get(`${API}/products/get_all_products`);
      setNewArrivals(resNewArrivals.data);
      console.log(resNewArrivals.data);

    } catch (error) {
      console.error("Error:", error);
      toast.error("Error");
    }
  }

  return (
    <div className="flex flex-col h-screen relative bg-[#f9fafb] overflow-y-auto scrollbar-hide">
      {/* Diagonal Fade Bottom Grid Right Background */}
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
  
  )
};

export default HomePage;