import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { fs } from "../config/Config";
import { deleteImageFromCloudinary, handleImageUpload } from "../utils/utility";
import { useParams } from "react-router-dom";

const EditProduct = () => {
    const { productId } = useParams();
    const [prevImage, setPrevImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [product, setProduct] = useState({
        image: "",
        title: "",
        description: "",
        price: "",
        rating: "",
        stock: "",
        isTop: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const isImageChanged = useRef(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(fs, "products", productId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct((prev) => ({ ...prev, ...docSnap.data() }));
                    setPrevImage(docSnap.data().image);
                    setSelectedImage(docSnap.data().image);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [productId]);

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
                if (!value.trim()) error = "Image URL is required.";
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;

        setProduct((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        // Validate field
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, fieldValue),
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const types = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];

        if (!file) {
            setErrors((prev) => ({ ...prev, image: "Please select an image." }));
            return;
        }

        if (!types.includes(file.type)) {
            setErrors((prev) => ({
                ...prev,
                image: "Invalid file type. Only JPG, JPEG, and PNG are allowed.",
            }));
            return;
        }
        setSelectedImage(file);
        isImageChanged.current = true;
        // try {
        //   const uploadedUrl = await handleImageUpload(file);
        //   setProduct((prev) => ({ ...prev, image: uploadedUrl }));
        //   setErrors((prev) => ({ ...prev, image: "" }));
        // } catch (error) {
        //   console.error("Error uploading image:", error);
        //   setErrors((prev) => ({ ...prev, image: "Failed to upload image." }));
        // }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        Object.keys(product).forEach((key) => {
            validationErrors[key] = validateField(key, product[key]);
        });

        if (Object.values(validationErrors).some((error) => error)) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        const dataToUpdate = {...product};
        try {
           if(isImageChanged.current){
            const imageUrl = await handleImageUpload(selectedImage);
            if (!imageUrl) return alert("Image upload failed");
            dataToUpdate.image = imageUrl;
        }
            const docRef = doc(fs, "products", productId);
            Object.keys(dataToUpdate).forEach((key) => {
                if(["stock", "rating",  "price"].includes(key)) dataToUpdate[key] = Number(dataToUpdate[key]);
            })
            await updateDoc(docRef, dataToUpdate);
            alert("Product updated successfully!");
            setProduct(dataToUpdate)
            if(isImageChanged.current){
                const response = await deleteImageFromCloudinary(prevImage);
                if(!response){
                    console.log("Error deleting image from cloudinary");
                }
            }
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image */}
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-gray-700"
                    />
                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                    {selectedImage && (
                        <img
                            src={typeof selectedImage === "string" ? selectedImage : URL.createObjectURL(selectedImage)}
                            alt="Product"
                            className="mt-4 h-24 w-24 object-cover rounded"
                        />
                    )}
                </div>

                {/* Title */}
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description}</p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                {/* Rating */}
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Rating</label>
                    <input
                        type="number"
                        name="rating"
                        value={product.rating}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
                </div>

                {/* Stock */}
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
                </div>

                {/* Top Product */}
                <div>
                    <label className="block font-medium text-gray-700 mb-2">
                        Top Product
                    </label>
                    <input
                        type="checkbox"
                        name="isTop"
                        checked={product.isTop}
                        onChange={handleChange}
                        className="h-5 w-5"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full py-2 text-white font-medium rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
