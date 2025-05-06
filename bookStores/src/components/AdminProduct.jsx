import React, { useEffect, useRef, useState } from "react";
import { fs } from "../config/Config";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import AlertDialog from "./AlertDialogue";
import { deleteImageFromCloudinary } from "../utils/utility";
import { useNavigate } from "react-router-dom";

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const productToBeDeleteRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productSnapshot = await getDocs(collection(fs, "products"));
                const productList = productSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productList);
            } catch (error) {
                console.error("Error fetching products: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    async function deleteProduct(product) {        
        const productRef = doc(fs, "products", product.id);
        try {
          await deleteDoc(productRef);
          setProducts(prev => prev.filter(p => p.id !== product.id));
          return true;
        } catch (error) {
          console.error("Error deleting product: ", error);
        }
        return false;
      }

    const handleProductDelete = async() => {
        if(!productToBeDeleteRef.current) return;
        setDeleteLoading(true);
        if(productToBeDeleteRef.current.image){
            const response = await deleteImageFromCloudinary(productToBeDeleteRef.current.image);
            if(!response){
                console.log("Error deleting image from cloudinary");
            }
        }
        const deletedResponse = await deleteProduct(productToBeDeleteRef.current);
        setAlertVisible(false);
        if(deletedResponse){
            alert("Product deleted successfully!");
        }
        setDeleteLoading(false);
    }

    const handleEdit = (productId) => {
        navigate(`/edit-product/${productId}`);
    }

    return (
        <>
        {alertVisible && <AlertDialog
            text={"Are you sure you want to delete this product?"}
            onCancel={() => setAlertVisible(false)}
            onConfirm={handleProductDelete}
            cancelText={"Cancel"}
            confirmText={"Delete"}
            loading={deleteLoading}
        />}
        <div className="px-4 pt-5 bg-gray-50 min-h-screen flex flex-col items-center ">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Products</h1> 
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">Image</th>
                                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">Title</th>
                                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">Description</th>
                                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">Price</th>
                                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">Rating</th>
                                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">Stock</th>
                                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">Top Product</th>
                                <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr
                                    key={product.id}
                                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                        } hover:bg-gray-200 transition-all duration-200`}
                                >
                                    <td className="px-6 py-4">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-16 h-16 object-cover rounded-md shadow-md border"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">{product.title}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm truncate max-w-xs">{product.description}</td>
                                    <td className="px-6 py-4 text-gray-800 font-semibold">Rs {product.price}</td>
                                    <td className="px-6 py-4 text-yellow-500 font-bold">{product.rating} ★</td>
                                    <td className="px-6 py-4 text-gray-800">{product.stock}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`px-3 py-1 text-sm rounded-full font-medium text-white ${{
                                                true: "bg-green-500",
                                                false: "bg-red-500",
                                            }[product.isTop]}`}
                                        >
                                            {product.isTop ? "Yes" : "No"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(product.id)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAlertVisible(true);
                                                productToBeDeleteRef.current = product
                                            }}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </>
    );
};

export default AdminProduct;
