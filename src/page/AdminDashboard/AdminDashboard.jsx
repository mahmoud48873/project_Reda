// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018

/**
 * Developer: Mahmoud Sameh Fathy Ibrahim
 * Student Code: 624018
 * 
 * Description: Admin Dashboard Component for adding & deleting products dynamically in Firestore 'products' collection.
 * Features: Image compression before upload, Base64 conversion, live preview, product list with red delete button and confirm dialog.
 * Styled with AdminDashboard.css and Tailwind CSS for clean, centered, responsive, dark-mode compatible UI.
 */

import React, { useState, useEffect, useContext } from 'react';
import './AdminDashboard.css';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { ToastContext } from '../../components/context/ToastContext';
import { LanguageContext } from '../../components/context/LanguageContext';
import { BiErrorCircle, BiCheckCircle } from 'react-icons/bi';
import { FaPlusCircle, FaBox, FaDollarSign, FaImage, FaList, FaFileAlt, FaLayerGroup, FaUpload, FaLink, FaTrash, FaSpinner } from 'react-icons/fa';

function AdminDashboard() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'local'
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');

    // Products List State for Delete feature
    const [productsList, setProductsList] = useState([]);
    const [isFetchingProducts, setIsFetchingProducts] = useState(false);

    const { showToast } = useContext(ToastContext) || {};
    const { t } = useContext(LanguageContext) || { t: (key) => key };

    // Fetch existing products from Firestore
    const fetchProductsList = async () => {
        setIsFetchingProducts(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const items = [];
            querySnapshot.forEach((docSnap) => {
                items.push({ id: docSnap.id, ...docSnap.data() });
            });
            setProductsList(items);
        } catch (err) {
            console.error("Error fetching products list:", err);
        } finally {
            setIsFetchingProducts(false);
        }
    };

    useEffect(() => {
        fetchProductsList();
    }, []);

    // Compress image and convert to Base64 data URL (no Firebase Storage needed)
    const compressImageToBase64 = (file, maxWidth = 600, quality = 0.6) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!name.trim() || !price || !stock || !description.trim() || !category.trim()) {
            setError('Please fill in all required fields.');
            return;
        }
        
        if (uploadMethod === 'url' && !image.trim()) {
            setError('Please provide an image URL.');
            return;
        }

        if (uploadMethod === 'local' && !imageFile) {
            setError('Please select an image file to upload.');
            return;
        }

        if (isNaN(price) || Number(price) <= 0) {
            setError('Please enter a valid price greater than 0.');
            return;
        }

        if (isNaN(stock) || Number(stock) < 0) {
            setError('Please enter a valid stock quantity (0 or more).');
            return;
        }

        setIsLoading(true);
        setUploadProgress('');

        try {
            let finalImageUrl = image.trim();

            if (uploadMethod === 'local' && imageFile) {
                setUploadProgress('Compressing image...');
                finalImageUrl = await compressImageToBase64(imageFile);
                setUploadProgress('Image ready! Saving product...');
            }

            setUploadProgress('Saving product to Firestore...');

            const newProductData = {
                title: name.trim(),
                name: name.trim(),
                price: parseFloat(price),
                thumbnail: finalImageUrl,
                images: [finalImageUrl],
                imageUrl: finalImageUrl,
                description: description.trim(),
                category: category.trim().toLowerCase(),
                rating: 5.0,
                stock: parseInt(stock),
                createdAt: new Date().toISOString(),
                timestamp: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'products'), newProductData);

            console.log("Product added to Firestore with ID:", docRef.id);

            const msg = 'Product added successfully! 🎉';
            setSuccessMsg(msg);
            setUploadProgress('');

            if (showToast) {
                showToast('Product added successfully! 🎉', 'success');
            }

            // Immediately append to local products list state without page refresh
            setProductsList(prev => [{ id: docRef.id, ...newProductData }, ...prev]);

            // Reset form fields
            setName('');
            setPrice('');
            setStock('');
            setImage('');
            setImageFile(null);
            setImagePreview('');
            setDescription('');
            setCategory('');

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setUploadProgress('');
            console.error("Error adding product:", err);
            setError(err.message || 'Error adding product. Please try again.');
        }
    };

    // Delete Product handler with confirmation alert
    const handleDeleteProduct = async (productId, productName) => {
        const confirmMsg = `هل أنت تأكد من حذف المنتج "${productName}"؟\n\nAre you sure you want to delete "${productName}"?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            await deleteDoc(doc(db, 'products', productId));
            // Update UI state immediately without refreshing
            setProductsList(prev => prev.filter(item => item.id !== productId));

            if (showToast) {
                showToast('تم حذف المنتج بنجاح 🗑️', 'info');
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            alert('حدث خطأ أثناء حذف المنتج: ' + err.message);
        }
    };

    return (
        <div className="admin_page">
            <div className="admin_container">
                
                {/* Header Banner */}
                <div className="admin_header_banner">
                    <div className="admin_banner_info">
                        <div className="admin_banner_icon">
                            <FaPlusCircle />
                        </div>
                        <div className="admin_banner_text">
                            <h1>Admin Dashboard</h1>
                            <p>Manage products: Add new items & Delete existing products from Firestore</p>
                        </div>
                    </div>
                </div>

                {/* 1. Add Product Form Card */}
                <div className="admin_card mb-10">
                    
                    <h2 className="admin_card_title">
                        <FaLayerGroup />
                        <span>Add New Product (إضافة منتج جديد)</span>
                    </h2>

                    {/* Error Alert */}
                    {error && (
                        <div className="beautiful_error_box">
                            <BiErrorCircle className="error_icon" />
                            <div className="error_content">
                                <h4>Add Product Error</h4>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Alert */}
                    {successMsg && (
                        <div className="beautiful_success_box">
                            <BiCheckCircle className="success_icon" />
                            <div className="success_content">
                                <h4>Product Saved Successfully!</h4>
                                <p>{successMsg}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="admin_form">
                        <div className="admin_form_grid">
                            
                            {/* Product Name */}
                            <div className="admin_form_group">
                                <label htmlFor="name">
                                    <FaBox />
                                    <span>Product Name *</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="e.g. iPhone 15 Pro Max / Dell Laptop"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Price */}
                            <div className="admin_form_group">
                                <label htmlFor="price">
                                    <FaDollarSign />
                                    <span>Price ($ USD) *</span>
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    step="0.01"
                                    min="0"
                                    placeholder="e.g. 299.99"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Stock Quantity */}
                            <div className="admin_form_group">
                                <label htmlFor="stock">
                                    <FaLayerGroup />
                                    <span>Stock Quantity *</span>
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    min="0"
                                    placeholder="e.g. 50"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Category */}
                            <div className="admin_form_group">
                                <label htmlFor="category">
                                    <FaList />
                                    <span>Category *</span>
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">-- Select Category --</option>
                                    <option value="smartphones">Smartphones</option>
                                    <option value="laptops">Laptops</option>
                                    <option value="mobile-accessories">Mobile Accessories</option>
                                    <option value="tablets">Tablets & iPads</option>
                                    <option value="mens-shirts">Men's Shirts</option>
                                    <option value="mens-shoes">Men's Shoes</option>
                                    <option value="mens-watches">Men's Watches</option>
                                    <option value="womens-dresses">Women's Dresses</option>
                                    <option value="womens-bags">Women's Bags</option>
                                    <option value="beauty">Beauty & Skincare</option>
                                    <option value="home-decoration">Home & Living</option>
                                </select>
                            </div>

                            {/* Image Upload Toggle */}
                            <div className="admin_form_group">
                                <label>
                                    <FaImage />
                                    <span>Product Image *</span>
                                </label>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setUploadMethod('url')}
                                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc', background: uploadMethod === 'url' ? '#0090f0' : '#fff', color: uploadMethod === 'url' ? '#fff' : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}
                                    >
                                        <FaLink /> Image URL
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setUploadMethod('local')}
                                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc', background: uploadMethod === 'local' ? '#0090f0' : '#fff', color: uploadMethod === 'local' ? '#fff' : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}
                                    >
                                        <FaUpload /> Upload Local
                                    </button>
                                </div>
                                
                                {uploadMethod === 'url' ? (
                                    <input
                                        type="url"
                                        placeholder="https://example.com/product-image.jpg"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        required={uploadMethod === 'url'}
                                        disabled={isLoading}
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required={uploadMethod === 'local'}
                                        disabled={isLoading}
                                        style={{ padding: '9px 12px' }}
                                    />
                                )}
                            </div>

                            {/* Live Image Preview Box */}
                            {(imagePreview || (image && image.startsWith('http'))) && (
                                <div className="admin_image_preview_box">
                                    <img
                                        src={uploadMethod === 'local' ? imagePreview : image}
                                        alt="Product Preview"
                                        className="preview_img"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <div className="preview_text">
                                        <h5>Live Image Preview</h5>
                                        <p>{image || 'Local File Selected'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="admin_form_group full_width">
                                <label htmlFor="description">
                                    <FaFileAlt />
                                    <span>Description *</span>
                                </label>
                                <textarea
                                    id="description"
                                    rows="4"
                                    placeholder="Write a detailed description and specs for this product..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    disabled={isLoading}
                                ></textarea>
                            </div>

                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="admin_submit_btn" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="btn_spinner"></span>
                                    <span>{uploadProgress || 'Adding Product...'}</span>
                                </>
                            ) : (
                                <>
                                    <FaPlusCircle />
                                    <span>Add Product to Firestore</span>
                                </>
                            )}
                        </button>

                    </form>
                </div>

                {/* 2. Existing Products List Section (Delete Product Feature) */}
                <div className="admin_card" style={{ marginTop: '32px' }}>
                    <div className="admin_manage_header">
                        <h2 className="admin_manage_title">
                            <FaTrash />
                            <span>Manage Existing Products (حذف المنتجات)</span>
                        </h2>
                        <span className="admin_total_badge">
                            Total: {productsList.length}
                        </span>
                    </div>

                    {isFetchingProducts ? (
                        <div style={{ padding: '48px 0', textAlign: 'center', color: '#888', display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '10px' }}>
                            <FaSpinner className="animate-spin text-2xl text-blue-600" />
                            <span>Loading products from Firestore...</span>
                        </div>
                    ) : productsList.length === 0 ? (
                        <div style={{ padding: '48px 20px', textAlign: 'center', color: '#aaa', background: 'var(--bg_color)', borderRadius: '12px', border: '1px dashed var(--border_color)' }}>
                            <FaBox style={{ fontSize: '36px', margin: '0 auto 12px auto', opacity: 0.5 }} />
                            <p style={{ fontWeight: 700, color: 'var(--color_heading)', margin: 0 }}>No products found in Firestore yet.</p>
                            <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>Add your first product above to manage it here.</p>
                        </div>
                    ) : (
                        <div className="admin_products_grid">
                            {productsList.map((prod) => {
                                const prodImg = prod.imageUrl || prod.thumbnail || (prod.images && prod.images[0]) || '';
                                return (
                                    <div key={prod.id} className="admin_product_item">
                                        <div className="admin_product_left">
                                            {prodImg ? (
                                                <img 
                                                    src={prodImg} 
                                                    alt={prod.title || prod.name} 
                                                    className="admin_product_thumb"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="admin_product_thumb_fallback">
                                                    <FaBox />
                                                </div>
                                            )}
                                            <div className="admin_product_info">
                                                <h4>{prod.title || prod.name}</h4>
                                                <span className="admin_product_cat">{prod.category || 'General'}</span>
                                                <p className="admin_product_price">${prod.price}</p>
                                                <span className="admin_product_stock">Stock: {prod.stock ?? '—'}</span>
                                            </div>
                                        </div>

                                        {/* Red Warning Delete Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteProduct(prod.id, prod.title || prod.name)}
                                            className="admin_delete_btn"
                                            title="Delete product from Firestore"
                                        >
                                            <FaTrash />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;
