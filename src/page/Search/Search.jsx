import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Product from '../../components/sliderProducts/Product';
import Loading from '../../components/loading/Loading';
import './Search.css';

function Search() {
    const location = useLocation();
    
    // Extract search query from URL
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(!!query);
    
    const [prevQuery, setPrevQuery] = useState(query);
    if (query !== prevQuery) {
        setPrevQuery(query);
        if (!query) {
            setProducts([]);
            setLoading(false);
        } else {
            setLoading(true);
        }
    }

    useEffect(() => {
        if (!query) return;
        
        fetch(`https://dummyjson.com/products/search?q=${query}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching search results:", error);
                setLoading(false);
            });
    }, [query]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='search_page'>
            <div className="container">
                <h1 className='search_title'>
                    {query ? `Search Results for: "${query}"` : "Search Products"}
                </h1>
                
                {products.length === 0 && query ? (
                    <p className='no_results'>No products found matching your search.</p>
                ) : (
                    <div className='search_grid'>
                        {products.map((item) => (
                            <Product key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
