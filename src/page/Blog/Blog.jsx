import React from 'react';
import './Blog.css';

function Blog() {
    return (
        <div className='static_page'>
            <div className="container">
                <h1 className='page_title'>Our Blog</h1>
                <div className='page_content'>
                    <p>Stay updated with our latest news, product features, and tips on how to get the most out of your devices.</p>
                </div>
                <div className='placeholder_grid'>
                    <p>No articles to display at the moment. Please check back later!</p>
                </div>
            </div>
        </div>
    );
}

export default Blog;
