import React from 'react';
import './ProductCard.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    dispatch(addToCart({...product, quantity: 1}));
    
  }
  return (
    <div className="product-card">
      {product.isTop && <div className="top-banner">TOP</div>}
      <img src={product.image} alt={product.title} className="product-image" />
      <h3 className="product-title">{product.title}</h3>
      <div className="product-rating">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < product.rating ? 'star filled' : 'star'}>★</span>
        ))}
      </div>
      <p className="product-price">Rs:{Number(product.price).toFixed(2)}</p>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
