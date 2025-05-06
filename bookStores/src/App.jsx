import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/Home"
import Signup from "./components/Signup";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import AddProductForm from "./components/AddProductForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/slices/userSlices';
import { auth, fs } from './config/Config';
import React, { useEffect, useState } from 'react';
import AdminRoute from './components/AdminRoute';
import { loadCartData } from './redux/slices/cartSlice';
import Cart from './components/Cart';
import Statistics from './components/Statistics';
import AdminProduct from './components/AdminProduct';
import Customers from './components/Customers';
import SideBar from './components/SideBar';
import EditProduct from './components/EditProduct';
import AdminOrders from './components/AdminOrders';
import MyOrders from './components/MyOrders';

function App() {
  const { isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    if (isAuthenticated) return
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        console.log("User is authenticated:", currentUser.uid);
        // Fetch user data from Firestore
        fs.collection('users')
          .doc(currentUser.uid)
          .get()
          .then((snapshot) => {
            console.log("snapshot", snapshot.exists);
            if (snapshot.exists) {
              const userData = snapshot.data();
              console.log("User data from Firestore:", userData);
              dispatch(setUser({...userData, id: currentUser.uid}));
            } else {
              console.error("User document not found in Firestore.");
              dispatch(setUser({}));
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            dispatch(setUser({}));
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        console.log("No user is signed in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dispatch(loadCartData());
  }, [])


  if (loading) {
    return <h2>Loading...</h2>; // Show a loading message while data is being fetched
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route exact path="/signup" Component={Signup} />
        <Route exact path="login" Component={Login} />
        <Route exact path="cart" Component={Cart} />

        <Route path="/my-orders" element={<ProtectedRoute>
          <MyOrders/>
        </ProtectedRoute>} />

        <Route path="/dashboard" element={<AdminRoute>
          <SideBar>
            <Statistics />
          </SideBar>
        </AdminRoute>} />
        <Route path="/products" element={<AdminRoute>
          <SideBar>
            <AdminProduct />
          </SideBar>
        </AdminRoute>} />
        <Route path="/add-product" element={<AdminRoute>
          <SideBar>
            <AddProductForm />
          </SideBar>
        </AdminRoute>} />
        <Route path="/edit-product/:productId" element={<AdminRoute>
          <SideBar>
            <EditProduct />
          </SideBar>
        </AdminRoute>} />
        <Route path="/orders" element={<AdminRoute>
          <SideBar>
            <AdminOrders />
          </SideBar>
        </AdminRoute>} />
        <Route path="/customers" element={<AdminRoute>
          <SideBar>
            <Customers />
          </SideBar>
        </AdminRoute>} />
        <Route Component={NotFound} />
      </Routes >
    </BrowserRouter>
  )
}

export default App
