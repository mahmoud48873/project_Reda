import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination  } from "swiper/modules";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

export default function HeroSlider() {
  const { t } = useContext(LanguageContext) || {};

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
                <h4>{t ? t('heroSub1') : 'Introducing the new'}</h4>
                <h3>
                  {t ? t('heroTitle1') : 'Microsoft Xbox 360 Controller'}
                </h3>
                <p>{t ? t('heroDesc1') : 'Windows 11 Compatible'}</p>
                <Link to="/" className="btn">
                  {t ? t('shopNow') : 'Shop Now'}
                </Link>
              </div>
              <img src="/src/img/banner_Hero1.jpg" alt="Banner 1" />
            </SwiperSlide>
            <SwiperSlide>
              <div className="content">
                <h4>{t ? t('heroSub1') : 'Introducing the new'}</h4>
                <h3>
                  {t ? t('heroTitle1') : 'Microsoft Xbox 360 Controller'}
                </h3>
                <p>{t ? t('heroDesc1') : 'Windows 11 Compatible'}</p>
                <Link to="/" className="btn">
                  {t ? t('shopNow') : 'Shop Now'}
                </Link>
              </div>
              <img src="/src/img/banner_Hero2.jpg" alt="Banner 2" />
            </SwiperSlide>
            <SwiperSlide>
              <div className="content">
                <h4>{t ? t('heroSub1') : 'Introducing the new'}</h4>
                <h3>
                  {t ? t('heroTitle1') : 'Microsoft Xbox 360 Controller'}
                </h3>
                <p>{t ? t('heroDesc1') : 'Windows 11 Compatible'}</p>
                <Link to="/" className="btn">
                  {t ? t('shopNow') : 'Shop Now'}
                </Link>
              </div>
              <img src="/src/img/banner_Hero3.jpg" alt="Banner 3" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
