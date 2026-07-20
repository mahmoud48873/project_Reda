import "./Home.css";
import HeroSlider from "../../components/header/HeroSlider";
import SliderProduct from "../../components/sliderProducts/SilederProduct";
import { useEffect, useState, useContext } from "react";
import Loading from "../../components/loading/Loading";
import { LanguageContext } from "../../components/context/LanguageContext";

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
const { t } = useContext(LanguageContext) || {};
const[products,setProducts] =useState({})
const[firebaseProducts, setFirebaseProducts] = useState([])
const[loading,setLoading] =useState(true)



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch DummyJSON Products
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

        // Fetch Firebase Products (Admin-added products from Firestore)
        try {
          const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
          const { db } = await import('../../firebase');
          let querySnapshot;
          try {
            const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
            querySnapshot = await getDocs(q);
          } catch {
            querySnapshot = await getDocs(collection(db, 'products'));
          }
          const fbProducts = [];
          const now = new Date().getTime();
          const threshold = 24 * 60 * 60 * 1000; // 24 hours

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const createdAtTime = data.createdAt ? new Date(data.createdAt).getTime() : 0;
            
            if (now - createdAtTime <= threshold) {
              fbProducts.push({ id: doc.id, ...data });
            } else {
              const cat = data.category;
              if (cat) {
                if (!productsdata[cat]) {
                  productsdata[cat] = [];
                }
                // Add to beginning of its category slider so it appears first
                productsdata[cat].unshift({ id: doc.id, ...data });
              }
            }
          });

          // Sort client-side by createdAt (newest first)
          fbProducts.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setFirebaseProducts(fbProducts);
        } catch (fbErr) {
          console.error("Error fetching Firebase products:", fbErr);
        }

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
        <>
          {categories.map((_, index) => (
            <Loading key={index} />
          ))}
        </>
      ) : (
        <>
          {/* Firestore Admin Uploaded Products */}
          {firebaseProducts && firebaseProducts.length > 0 && (
            <SliderProduct 
              key="firebase_products"
              data={firebaseProducts}
              title={t ? t('newArrivals') : "✨ New Arrivals ✨"}
            />
          )}

          {/* All Categories */}
          {Array.from(new Set([...categories, ...Object.keys(products)])).map((category) => (
            products[category] && products[category].length > 0 && (
              <SliderProduct 
                key={category} 
                data={products[category]} 
                title={category}
              />
            )
          ))}
        </>
      )}
    </div>
  );
}

export default Home;
