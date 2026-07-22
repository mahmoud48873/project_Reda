// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../../components/sliderProducts/Product';
import Loading from '../../components/loading/Loading';
import ProductFilters from '../../components/filters/ProductFilters';
import { LanguageContext } from '../../components/context/LanguageContext';
import './Category.css';

function Category() {
    const { categoryName } = useParams();
    const { t, tCategory } = useContext(LanguageContext) || {};
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('default');
    const [selectedBrand, setSelectedBrand] = useState('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        fetch(`https://dummyjson.com/products/category/${categoryName}`)
            .then(res => res.json())
            .then(data => {
                const fetchedProducts = data.products || [];
                setProducts(fetchedProducts);
                // Calculate max price
                const highest = Math.max(...fetchedProducts.map(p => p.price || 0), 100);
                setPriceRange([0, Math.ceil(highest)]);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching category products:", error);
                setLoading(false);
            });
    }, [categoryName]);

    const maxPriceLimit = useMemo(() => {
        if (products.length === 0) return 2000;
        return Math.ceil(Math.max(...products.map(p => p.price || 0), 100));
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (p.price > priceRange[1]) return false;
            if (minRating > 0 && (p.rating || 0) < minRating) return false;
            if (selectedBrand && p.brand !== selectedBrand) return false;
            return true;
        }).sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
            return 0;
        });
    }, [products, priceRange, minRating, sortBy, selectedBrand]);

    const handleReset = () => {
        setPriceRange([0, maxPriceLimit]);
        setMinRating(0);
        setSortBy('default');
        setSelectedBrand('');
    };

    if (loading) {
        return <Loading />;
    }

    const categoryTitleTranslated = tCategory ? tCategory(categoryName) : categoryName.replace('-', ' ');

    return (
        <div className='category_page'>
            <div className="container">
                <div className="category_header_wrap">
                    <h1 className='category_title'>
                        {categoryTitleTranslated}
                    </h1>
                    <span className="products_count_badge">
                        {filteredProducts.length} / {products.length}
                    </span>
                </div>

                <div className="category_layout">
                    <aside className="category_sidebar">
                        <ProductFilters
                            products={products}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            maxPriceLimit={maxPriceLimit}
                            minRating={minRating}
                            setMinRating={setMinRating}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            selectedBrand={selectedBrand}
                            setSelectedBrand={setSelectedBrand}
                            onReset={handleReset}
                        />
                    </aside>

                    <main className="category_main_content">
                        {filteredProducts.length === 0 ? (
                            <div className="no_results_card">
                                <h3>{t ? t('noProductsFound') : 'No products match your filters'}</h3>
                                <button className="btn btn-primary" onClick={handleReset}>{t ? t('reset') : 'Clear Filters'}</button>
                            </div>
                        ) : (
                            <div className='category_grid'>
                                {filteredProducts.map((item) => (
                                    <Product key={item.id} item={item} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Category;
