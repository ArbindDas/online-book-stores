import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';
import {v4 as uuid} from "uuid";
import { fs } from '../config/Config';
import { collection, getDocs } from "firebase/firestore";


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const productsCollection = collection(fs, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [])
  
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
