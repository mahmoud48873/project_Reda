import React from "react";
import { IoStar } from "react-icons/io5";
import { IoMdStarHalf } from "react-icons/io";
import { FaCartPlus, FaShare } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";






export default function Product({item}) {

  return (
    <div className="poduct   ">
      <div className="img_product">
        <img
          src={item.images[0]}
          alt=""
        />
      </div>
      <p className="name_product">
 {item.title}
      </p>
      <div className="starts">
        <IoStar />
        <IoStar />
        <IoStar />
        <IoStar />
        <IoMdStarHalf />
      </div>
      <p className="price"><span>${item.price}</span></p>

      <div className="icons">
        <span>
          <FaCartPlus />
        </span>
        <span>
          <CiHeart />
        </span>
        <span>
          <FaShare />
        </span>
      </div>
    </div>
  );
}
