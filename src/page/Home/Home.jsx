import "./Home.css";
import HeroSlider from "../../components/header/HeroSlider";
import SliderProduct from "../../components/sliderProducts/SilederProduct";
import { useEffect, useState } from "react";

const categories = [
  "smartphones",
  "mobile-accessories",
  "laptops",
  "tablets",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
];

function Home() {



const[products,setProducts] =useState({})
const[loading,setLoading] =useState(true)



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resulte = await Promise.all(
          categories.map(async (category) => {
            const res = await fetch(
              `https://dummyjson.com/products/category/${category}`
            );
            const data = await res.json();
            return { [category]: data.products };
          })
        );

        const productsdata = Object.assign({}, ...resulte);
        setProducts(productsdata);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <HeroSlider />

      {loading ? (
        <p>Loading</p>
      ) : (
        <>
          {categories.map((category) => (
            <SliderProduct 
              key={category} 
              data={products[category] || []} 
              title={category}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default Home;
