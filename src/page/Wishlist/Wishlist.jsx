import React, { useContext } from 'react'
import { WishlistContext } from '../../components/context/WishlistContext'
import Product from '../../components/sliderProducts/Product'
import './Wishlist.css'

function Wishlist() {
    const { wishlistItems } = useContext(WishlistContext)

    return (
        <div className='wishlist_page'>
            <div className="container">
                <h1 className='title_wishlist'>Favorites Page</h1>
                {wishlistItems.length === 0 ? (
                    <p className='empty_wishlist'>Your Wishlist is Empty</p>
                ) : (
                    <div className='wishlist_grid'>
                        {wishlistItems.map((item, index) => (
                            <Product key={index} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wishlist
