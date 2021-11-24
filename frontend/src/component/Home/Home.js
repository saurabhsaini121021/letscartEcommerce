import React, { Fragment, useEffect, useState } from 'react'
import { BsArrowDownCircleFill } from 'react-icons/all';
import './Home.css';
import ProductCard from './ProductCard.js'
import MetaData from '../layout/MetaData'
import { clearErrors, getProduct } from '../../actions/productAction'
import { useDispatch, useSelector } from "react-redux"
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';



const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { error, products,
        //  productsCount
    } = useSelector((state) => state.products);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [])
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    }, [dispatch, error, alert])
    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Let's Cart" />
                    <div className="banner">
                        <h1>Welcome to Let's Cart</h1>
                        <p>DON'T WORRY WE HAVE IT</p>

                        <a href="#container">
                            <button>
                                Get Products <BsArrowDownCircleFill />
                            </button>
                        </a>
                    </div>

                    <h2 className="homeHeading">Featured Products</h2>

                    <div className="container" id="container">
                        {products && products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    <Link to="/products" style={{ textDecoration: 'none' }}>
                        <div className="getAllProducts">
                            <button type="button">Get All Products</button>
                        </div>
                    </Link>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Home;
