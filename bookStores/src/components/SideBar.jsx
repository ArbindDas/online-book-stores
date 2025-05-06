import { Link } from "react-router-dom";

const SideBar = ({ children }) => {
    return (
        <div className="flex">
            <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <nav className="flex flex-col gap-4">
                    <Link to="/dashboard" className="bg-gray-700 p-2 rounded hover:bg-gray-600">Statistics</Link>
                    <Link to="/products" className="bg-gray-700 p-2 rounded hover:bg-gray-600">Products</Link>
                    <Link to="/add-product" className="bg-gray-700 p-2 rounded hover:bg-gray-600">Add Product</Link>
                    <Link to="/orders" className="bg-gray-700 p-2 rounded hover:bg-gray-600">Orders</Link>
                    <Link to="/customers" className="bg-gray-700 p-2 rounded hover:bg-gray-600">Customers</Link>
                </nav>
            </div>
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default SideBar;