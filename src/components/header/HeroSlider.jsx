import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination  } from "swiper/modules";
import { Link } from "react-router-dom";
export default function HeroSlider() {
  return (
    <div>
      <div className="Hero">
        <div className="container">
          <Swiper
          loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            pagination={true}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="content">
                <h4> Introducing the new</h4>
                <h3>
                  {" "}
                  Microsoft Xbox <br />
                  360 Controller{" "}
                </h3>
                <p> Windows 11 ..</p>
                <Link to="/" className="btn">
                  Shop Now
                </Link>
              </div>
              <img src="/src/img/banner_Hero1.jpg" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <div className="content">
                <h4> Introducing the new</h4>
                <h3>
                  {" "}
                  Microsoft Xbox
                  <br />
                  360 Controller{" "}
                </h3>
                <p> Windows 11 ..</p>
                <Link to="/" className="btn">
                  Shop Now
                </Link>
              </div>
              <img src="/src/img/banner_Hero2.jpg" alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <div className="content">
                <h4> Introducing the new</h4>
                <h3>
                  {" "}
                  Microsoft Xbox <br />
                  360 Controller{" "}
                </h3>
                <p> Windows 11 ..</p>
                <Link to="/" className="btn">
                  Shop Now
                </Link>
              </div>
              <img src="/src/img/banner_Hero3.jpg" alt="" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
