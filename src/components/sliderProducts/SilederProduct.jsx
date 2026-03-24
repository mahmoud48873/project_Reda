import React from "react";
import Product from "./Product";
import "./slideproduct.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function SilederProduct({ data, title }) {
  return (
    <div className="slider_products slide">
      <div className="container">
        <div className="top_slide">
          <h2>{title}</h2>
          <p>mahmoud sameh</p>
        </div>
        <Swiper
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1.3, spaceBetween: 5 },
            640: { slidesPerView: 2.2, spaceBetween: 10 },
            1024: { slidesPerView: 4.6, spaceBetween: 20 },
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
