import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fs } from "../config/Config";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersRef = collection(fs, "users");
        const querySnapshot = await getDocs(customersRef);

        const customerData = querySnapshot.docs.map((doc) => {
          const { email, fullName, isAdmin } = doc.data();
          return { id: doc.id, email, fullName, isAdmin: isAdmin || false };
        });
        setCustomers(customerData);
      } catch (error) {
        console.error("Error fetching customers: ", error);
      } finally { setLoading(false) }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center text-blue-600">Customer List</h1>
      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">Loading...</p>
      ) : customers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">#</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Full Name</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Admin</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-blue-100`}
                >
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {customer.fullName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-blue-500">
                    {customer.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 text-sm font-medium rounded ${customer.isAdmin
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {customer.isAdmin ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-4">No customers found.</p>
      )}
    </div>

  );
};

export default Customers;
