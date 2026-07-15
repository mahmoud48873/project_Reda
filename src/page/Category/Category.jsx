import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../../components/sliderProducts/Product';
import Loading from '../../components/loading/Loading';
import './Category.css';

function Category() {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [prevCategoryName, setPrevCategoryName] = useState(categoryName);
    if (categoryName !== prevCategoryName) {
        setPrevCategoryName(categoryName);
        setLoading(true);
    }

    useEffect(() => {
        fetch(`https://dummyjson.com/products/category/${categoryName}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching category products:", error);
                setLoading(false);
            });
    }, [categoryName]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='category_page'>
            <div className="container">
                <h1 className='category_title'>
                    {categoryName.replace('-', ' ').toUpperCase()} PRODUCTS
                </h1>
                
                {products.length === 0 ? (
                    <p className='no_results'>No products found for this category.</p>
                ) : (
                    <div className='category_grid'>
                        {products.map((item) => (
                            <Product key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Category;
