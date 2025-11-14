import React from "react";

const PromotionBanner = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      {/* Banner chính */}
      <div className="lg:col-span-2">
        <a
          href="#"
          className="block overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <img
            src="https://cdn0.fahasa.com/media/magentothem/banner7/BANNER_Slide_840x320.jpg"
            alt="Main Banner"
            className="w-full h-auto object-cover"
          />
        </a>
      </div>

      {/* 2 Banner phụ */}
      <div className="flex flex-col space-y-4">
        <a
          href="#"
          className="block overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <img
            src="https://cdn0.fahasa.com/media/magentothem/banner7/DealNgon_392x156.png"
            alt="Side Banner 1"
            className="w-full h-auto object-cover"
          />
        </a>
        <a
          href="#"
          className="block overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <img
            src="https://cdn0.fahasa.com/media/magentothem/banner7/Vpp_392x156_2.png"
            alt="Side Banner 2"
            className="w-full h-auto object-cover"
          />
        </a>
      </div>
    </section>
  );
};

export default PromotionBanner;