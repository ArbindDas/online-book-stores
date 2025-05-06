import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fs } from "../config/Config";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Statistics = () => {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    processedOrders: 0,
    deliveredOrders: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatistics = async () => {
    try {
      // Fetch orders
      const ordersRef = collection(fs, "orders");
      const ordersSnapshot = await getDocs(ordersRef);

      let pendingOrders = 0;
      let processedOrders = 0;
      let deliveredOrders = 0;

      ordersSnapshot.forEach((doc) => {
        const { status } = doc.data();
        if (status === "pending") pendingOrders++;
        if (status === "processed") processedOrders++;
        if (status === "delivered") deliveredOrders++;
      });

      // Fetch products
      const productsRef = collection(fs, "products");
      const productsSnapshot = await getDocs(productsRef);

      let lowStock = 0;
      let outOfStock = 0;

      productsSnapshot.forEach((doc) => {
        const { stock } = doc.data();
        if (stock === 0) outOfStock++;
        if (stock > 0 && stock < 5) lowStock++;
      });

      setStats({ pendingOrders, processedOrders, deliveredOrders, lowStock, outOfStock });
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Failed to fetch statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Chart Data
  const pieData = {
    labels: ["Pending", "Processed", "Delivered"],
    datasets: [
      {
        label: "Orders Status",
        data: [stats.pendingOrders, stats.processedOrders, stats.deliveredOrders],
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Low Stock", "Out of Stock"],
    datasets: [
      {
        label: "Stock Status",
        data: [stats.lowStock, stats.outOfStock],
        backgroundColor: ["#facc15", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Dashboard Statistics</h1>
      {loading ? (
        <p className="text-gray-600 text-center">Loading statistics...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders Statistics */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Orders Summary</h2>
            <Pie data={pieData} />
            <div className="mt-4">
              <p className="text-yellow-600">Pending Orders: {stats.pendingOrders}</p>
              <p className="text-blue-600">Processed Orders: {stats.processedOrders}</p>
              <p className="text-green-600">Delivered Orders: {stats.deliveredOrders}</p>
            </div>
          </div>

          {/* Stock Statistics */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Summary</h2>
            <Bar data={barData} />
            <div className="mt-4">
              <p className="text-yellow-600">Low Stock Products: {stats.lowStock}</p>
              <p className="text-red-600">Out of Stock Products: {stats.outOfStock}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
