import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { fs } from "../config/Config";
import { handleImageUpload } from "../utils/utility";
import { AlertCircle, Upload, Star, Package, DollarSign, FileText, Tag, IndianRupee } from "lucide-react";


const AddProduct = () => {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: "",
        image: null,
        rating: "",
        isTop: false,
        stock: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "title":
                if (!value.trim()) error = "Title is required.";
                break;
            case "description":
                if (!value.trim()) error = "Description is required.";
                break;
            case "price":
                if (!value || isNaN(value) || value <= 0)
                    error = "Price must be a positive number.";
                break;
            case "rating":
                if (!value || isNaN(value) || value < 0 || value > 5)
                    error = "Rating must be between 0 and 5.";
                break;
            case "stock":
                if (!value || isNaN(value) || value < 0)
                    error = "Stock must be a non-negative number.";
                break;
            case "image":
                if (!value) error = "Image is required.";
                break;
            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
        return error === "";
    };
    const validateForm = () => {
        const newErrors = {};

        Object.keys(product).forEach((key) => {
            if (!validateField(key, product[key])) {
                newErrors[key] = errors[key];
            }
        });

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;

        setProduct((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        validateField(name, fieldValue);
    };



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
            if (!validImageTypes.includes(file.type)) {
                setErrors((prev) => ({ ...prev, image: "Invalid file type. Please upload an image (JPEG, PNG, JPG, GIF)." }));
                setProduct((prev) => ({ ...prev, image: null }));
                setPreview(null);
                return;
            }
    
            setProduct((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, image: "" })); // Clear any previous errors
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
    
        try {
            const imageUrl = await handleImageUpload(product.image);
            if (!imageUrl) return alert("Image upload failed");
            const productRef = collection(fs, "products");
            const productData = { ...product, image: imageUrl };
            Object.keys(product).forEach((key) => {
                if (["stock", "rating", "price"].includes(key)) productData[key] = Number(product[key]);
            });
            await addDoc(productRef, productData);
            alert("Product added successfully!");
            setProduct({
                title: "",
                description: "",
                price: "",
                image: null,
                rating: "",
                isTop: false,
                stock: "",
            });
            setErrors({});
            setPreview(null); // Clear the preview after successful submission
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
                <div className="px-6 py-8">
                    <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
                        Add New Product
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Fill in the details below to add a new product to your inventory
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title Field */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Tag className="w-4 h-4" />
                                    Product Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={product.title}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.title ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter product title"
                                />
                                {errors.title && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.title}</span>
                                    </div>
                                )}
                            </div>

                            {/* Price Field */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    Price in RS
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none {errors.price ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter price"
                                />
                                {errors.price && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.price}</span>
                                    </div>
                                )}
                            </div>

                            {/* Rating Field */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Star className="w-4 h-4" />
                                    Rating
                                </label>
                                <input
                                    type="text"
                                    name="rating"
                                    value={product.rating}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.rating ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter rating (0-5)"
                                />
                                {errors.rating && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.rating}</span>
                                    </div>
                                )}
                            </div>

                            {/* Stock Field */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Package className="w-4 h-4" />
                                    Stock
                                </label>
                                <input
                                    type="text"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.stock ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter stock quantity"
                                />
                                {errors.stock && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.stock}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4" />
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] ${errors.description ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter product description"
                            />
                            {errors.description && (
                                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.description}</span>
                                </div>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Upload className="w-4 h-4" />
                                Product Image
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-[250px] object-contain"
                                            />
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span>  
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            {errors.image && (
                                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.image}</span>
                                </div>
                            )}
                        </div>

                        {/* Top Product Toggle */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isTop"
                                name="isTop"
                                checked={product.isTop}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="isTop" className="text-sm font-medium text-gray-700">
                                Mark as top product
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            ) : (
                                "Create Product"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default AddProduct;
