import React from "react";
import Product from "./Product";
import "./slideproduct.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";













export default function SilederProduct({data,title}) {
  return (
    <div className="slider_products slide">
      <div className="container">
        <div className="top_slide">
          <h2>{title}</h2>
          <p>
        mahmoud sameh
          </p>
        </div>
        <Swiper
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          slidesPerView={4.6}
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination,Autoplay]}
          className="mySwiper">
            {data && data.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <Product item={item} />
              </SwiperSlide>
            ))}
        
     
        </Swiper>
      </div>
    </div>
  );
}
