import React, { useContext } from "react";
import Product from "./Product";
import "./slideproduct.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { LanguageContext } from "../context/LanguageContext";

export default function SilederProduct({ data, title }) {
  const { tCategory } = useContext(LanguageContext) || {};
  const displayTitle = tCategory ? tCategory(title) : title;

  return (
    <div className="slider_products slide">
      <div className="container">
        <div className="top_slide">
          <h2>{displayTitle}</h2>
        </div>
        <Swiper
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1.3, spaceBetween: 10 },
            480: { slidesPerView: 2.1, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            992: { slidesPerView: 3.8, spaceBetween: 18 },
            1200: { slidesPerView: 4.6, spaceBetween: 20 },
          }}
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {data &&
            data.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <Product item={item} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
