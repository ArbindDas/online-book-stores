import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { fs } from "../config/Config";
import { useSelector } from "react-redux";

const MyOrders = () => {
  const { user } = useSelector((state) => state.user);
  const userId = user.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const ordersRef = collection(fs, "orders");
      const q = query(ordersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">My Orders</h1>
      {loading ? (
        <p className="text-gray-600 text-center">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-center">You have no orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="p-4 bg-white shadow rounded">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Order ID: <span className="text-blue-600">{order.id}</span>
                </h2>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      order.status === "pending"
                        ? "text-yellow-600"
                        : order.status === "processed"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-gray-600">
                  Total Price: <span className="font-semibold">Rs:{order.totalPrice.toFixed(2)}</span>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Products:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left bg-blue-600 text-white">Image</th>
                        <th className="border border-gray-300 px-4 py-2 text-left bg-blue-600 text-white">Title</th>
                        <th className="border border-gray-300 px-4 py-2 text-left bg-blue-600 text-white">Price</th>
                        <th className="border border-gray-300 px-4 py-2 text-left bg-blue-600 text-white">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-16 w-16 object-cover"
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{product.title}</td>
                          <td className="border border-gray-300 px-4 py-2">Rs:{product.price.toFixed(2)}</td>
                          <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
