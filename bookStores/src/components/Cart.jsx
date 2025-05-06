
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeFromCart, updateCart } from '../redux/slices/cartSlice';
import {fs} from '../config/Config';
import {addDoc, collection, doc, getDoc, updateDoc} from 'firebase/firestore';

const Cart = () => {
  const { cartItems } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.fullName,
    email: user.email,
    phone: "",
    address: "",
    paymentMethod: "COD",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
          /^[0-9]+@[0-9]+\.[a-zA-Z]{2,}$/.test(value)
        ) {
          error = "Invalid email address.";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Phone number must be 10 digits.";
        }
        break;
      case "address":
        if (!value.trim()) error = "Address is required.";
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    for (const [name, value] of Object.entries(formData)) {
      const error = validateField(name, value);
      if (error) newErrors[name] = error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if(!isAuthenticated){
      alert("Please login first");
      return;
    }
    if(formData.paymentMethod === "ONLINE"){
      alert("Do online payment first");
      return;
    }
    setLoading(true);

    const orderData = {
      userId: user.id,
      ...formData,
      products: cartItems.map(({ id, image, price, quantity, title }) => ({
        id,
        image,
        price,
        quantity,
        title,
      })),
      totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      status: "pending",
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === "ONLINE" ? "paid" : "unpaid",
    };

    try {
      // Add order to Firestore
      const orderRef = collection(fs, "orders");
      await addDoc(orderRef, orderData);

      // Update product quantities in Firestore
      const batchPromises = cartItems.map(async (product) => {
        const productRef = doc(fs, "products", product.id);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          const currentStock = productDoc.data().stock;
          await updateDoc(productRef, {
            stock: currentStock - product.quantity,
          });
        }
      });

      await Promise.all(batchPromises);

      alert("Order placed successfully!");
      setIsOpen(false);
      dispatch(clearCart());
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert("Please login first");
      return;
    }

    setIsOpen(true);
  }

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  }

  const handleQuantityChange = (product, action) => {
    if (action === 'increment' && product.quantity < product.stock) {
      dispatch(updateCart(cartItems.map(item => {
        if (item.id === product.id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })));
    } else if (action === 'decrement' && product.quantity > 1) {
      dispatch(updateCart(cartItems.map(item => {
        if (item.id === product.id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })));
    }
  }


  return (
    <div className="bg-gray-100 min-h-screen py-8">
      {isOpen && <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 relative rounded shadow-lg w-full max-w-lg">
        <p 
          onClick={() => {
            if(loading) return;
            setIsOpen(false);
          }}
          className='text-white text-2xl absolute top-1 text-center rounded-full right-2 w-[30px] h-[30px] cursor-pointer bg-red-500 z-50'>x</p>
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 rounded shadow ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>}


      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-800 font-bold">Price: ₹{product.price}</span>
                  <span className="text-gray-500 text-sm">Rating: {product.rating}</span>
                </div>
                <div className='flex items-center justify-start gap-5 mb-4'>
                  <p className="text-gray-700 font-medium">Quantity: </p>
                  <div className="flex items-center justify-center gap-3">
                    <span onClick={() => handleQuantityChange(product, 'decrement')} className='cursor-pointer px-2 rounded bg-[#ff0040] text-lg'>-</span>
                    <span>{product.quantity}</span>
                    <span onClick={() => handleQuantityChange(product, 'increment')} className='cursor-pointer px-2 rounded bg-[#15ff00] text-lg'>+</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove from Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && <div className="mt-8 text-center">
          <button
            onClick={handleBuyNow}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition text-lg font-semibold"
          >
            Buy Now
          </button>
        </div>}
      </div>
    </div>
  )
}

export default Cart
