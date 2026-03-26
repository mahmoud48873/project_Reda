import React from 'react';
import './Accessories.css';

function Accessories() {
    return (
        <div className='static_page'>
            <div className="container">
                <h1 className='page_title'>Accessories</h1>
                <div className='page_content'>
                    <p>Discover our wide range of premium accessories tailored fit your every need. From tech gadgets to daily essentials, we have it all.</p>
                </div>
                <div className='placeholder_grid'>
                    {/* Placeholder for future products */}
                    <p>More items coming soon...</p>
                </div>
            </div>
        </div>
    );
}

export default Accessories;
