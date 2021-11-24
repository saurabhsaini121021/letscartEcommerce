import React, { useEffect } from 'react';
import './App.css';
import Header from './component/layout/Header/Header.js';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import webFont from 'webfontloader';
import Footer from './component/layout/Footer/Footer'
import Home from './component/Home/Home.js';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products.js';
import Search from './component/Product/Search.js';
import LoginSignUp from './component/User/LoginSignUp.js';

import UserOptions from './component/layout/Header/UserOptions.js';
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile.js';
import UpdateProfile from './component/User/UpdateProfile.js';
import UpdatePassword from './component/User/UpdatePassword.js'
import ForgotPassword from './component/User/ForgotPassword.js';
import ResetPassword from './component/User/ResetPassword.js';
import Cart from './component/Cart/Cart.js'
import Shipping from './component/Cart/Shipping.js'
import ConfirmOrder from './component/Cart/ConfirmOrder.js'
import OrderSuccess from './component/Cart/OrderSuccess.js';
import store from './store';
import { loadUser } from './actions/userAction';
import StripePayment from './component/Cart/StripePayment';
import MyOrders from './component/Order/MyOrders.js';
import OrderDetails from './component/Order/OrderDetails.js';
import Dashboard from './component/Admin/Dashboard.js';
import ProductList from './component/Admin/ProductList.js';
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from './component/Admin/UpdateProduct.js'
import OrderList from './component/Admin/OrderList.js';
import ProcessOrder from './component/Admin/ProcessOrder.js'
import UsersList from './component/Admin/UsersList.js';
import UpdateUser from './component/Admin/UpdateUser.js';
import ProductReviews from './component/Admin/ProductReviews.js';
import About from './component/layout/About/About';
import Contact from './component/layout/Contact/Contact';


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user)


  useEffect(() => {

    webFont.load({
      google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
      },
    });
    store.dispatch(loadUser());
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:Keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/login" element={<LoginSignUp />} />
        {isAuthenticated &&
          <Route exact path="/account" element={<Profile />} />
        }
        {isAuthenticated &&
          <Route exact path="/me/update" element={<UpdateProfile />} />
        }
        {isAuthenticated &&
          <Route exact path="/password/update" element={<UpdatePassword />} />
        }
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route exact path="/password/reset/:token" element={<ResetPassword />} />
        <Route exact path="/cart" element={<Cart />} />
        {isAuthenticated &&
          <Route exact path="/shipping" element={<Shipping />} />
        }
        {isAuthenticated &&
          <Route exact path="/order/confirm" element={<ConfirmOrder />} />
        }
        {isAuthenticated &&
          <Route exact path="/payment/process" element={<StripePayment />} />
        }
        {isAuthenticated &&
          <Route exact path="/success" element={<OrderSuccess />} />
        }
        {isAuthenticated &&
          <Route exact path="/orders" element={<MyOrders />} />
        }
        {isAuthenticated &&
          <Route exact path="/order/:id" element={<OrderDetails />} />
        }

        {(isAuthenticated && user.role === "admin") &&
          <Route exact path="/admin/dashboard" element={<Dashboard />} />
        }
        {(isAuthenticated && user.role === "admin") &&

          <Route exact path="/admin/products" element={<ProductList />} />
        }
        {(isAuthenticated && user.role === "admin") &&
          <Route exact path="/admin/product" element={<NewProduct />} />

        }
        {(isAuthenticated && user.role === "admin") &&
          <Route exact path="/admin/product/:id" element={<UpdateProduct />} />
        }
        {(isAuthenticated && user.role === "admin") &&
          <Route exact path="/admin/orders" element={<OrderList />} />
        }
        {(isAuthenticated && user.role === "admin") &&
          <Route exact path="/admin/order/:id" element={<ProcessOrder />} />
        }
        {(isAuthenticated && user.role === "admin") &&
          <Route exact path="/admin/users" element={<UsersList />} />
        }
        {(isAuthenticated && user.role === "admin") &&
          <Route exact path="/admin/user/:id" element={<UpdateUser />} />
        }
        {(isAuthenticated && user.role === "admin") &&
          <Route exact path="/admin/reviews" element={<ProductReviews />} />
        }
        <Route exact path='/about' element={<About />} />
        <Route exact path='/contact' element={<Contact />} />

      </Routes>
      <Footer />
    </Router>

  );
}

export default App;
