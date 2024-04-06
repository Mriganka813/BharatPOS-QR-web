import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/product.scss';
import { FaCircleArrowRight } from "react-icons/fa6";
import Error from './Error';
import Loader from './Loader';
import InfiniteScrollLoader from './InfiniteScrollLoader';
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from 'react-hot-toast';

const Products = () => {

    const baseURL = import.meta.env.VITE_BASE_URL
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();
    const [shopName, setShopName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseURL}/api/v1/consumer/sellerProduct/${id}?page=${currentPage}`);
                setProducts(response.data.data);
                setTotalProducts(response.data.total_products);
                setShopName(response.data.sellerName);
                setError(null);

                const initialQuantities = {};
                response.data.data.forEach(product => {
                    initialQuantities[product._id] = 1;
                });
                setQuantities(initialQuantities);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const addToCart = (product) => {
        const itemId = product._id; // Using product ID as unique cart item ID
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            // If item already exists in the cart, just update its quantity
            const updatedCart = [...cart];
            updatedCart[itemIndex].quantity++;
            setCart(updatedCart);
        } else {
            // If item doesn't exist, add it to the cart
            const itemDetails = {
                id: itemId,
                price: product.sellingPrice,
                quantity: 1, // Default quantity is 1 when adding to cart
                product: product,
                saleCGST: product.saleCGST,
                saleSGST: product.saleSGST,
                saleIGST: product.saleIGST,
                baseSellingPrice: product.baseSellingPrice,
                discountAmt: product.discountAmt,
                originalbaseSellingPrice: product.originalbaseSellingPrice
            };
            setCart([...cart, itemDetails]);
        }
    };

    const incrementQuantity = (itemId) => {
        const updatedCart = [...cart];
        const itemIndex = updatedCart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            updatedCart[itemIndex].quantity++;
            setCart(updatedCart);
        }
    };

    const decrementQuantity = (itemId) => {
        const updatedCart = [...cart];
        const itemIndex = updatedCart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            updatedCart[itemIndex].quantity--;
            if (updatedCart[itemIndex].quantity <= 0) {
                updatedCart.splice(itemIndex, 1);
            }
            setCart(updatedCart);
        }
    };

    const proceedToCheckout = () => {
        console.log(cart);
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('phoneNumber', id);
        navigate('/checkout')
    };

    const fetchMoreData = async () => {
        try {
            const nextPage = currentPage + 1;
            const response = await axios.get(`${baseURL}/api/v1/consumer/sellerProduct/${id}?page=${nextPage}`);
            setTotalProducts(response.data.total_products);
            setProducts(prevProducts => [...prevProducts, ...response.data.data]);
            setCurrentPage(nextPage);
            setError(null);

        } catch (error) {
            toast.error('Error fetching more products:', error);
            setError('Error fetching more products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="product-container" style={{ marginBottom: cart.length > 0 ? '60px' : '0px' }}>
            <h1>{shopName}</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Error />
            ) : (
                <>
                    <InfiniteScroll
                        dataLength={products.length}
                        next={fetchMoreData}
                        hasMore={products.length < totalProducts}
                        loader={<InfiniteScrollLoader />}
                    >
                        <div className="product-cards">
                            {products.map((product, index) => (
                                <div key={product._id + index} className="product-card">
                                    <div className="card-details center">
                                        <h3>{product.name}</h3>
                                        <p>₹{product.sellingPrice}</p>
                                        {
                                            product.description ? <span className="description-para">{product.description}</span> : <></>
                                        }
                                    </div>
                                    <div className="prod-image center" style={{ backgroundColor: '#E0E1E4', backgroundImage: `url(${product.image})` }}>
                                        {cart.some(item => item.id === product._id) ? (
                                            <div className="add-to-cart center quantity-control">
                                                <p className="quantity-btn center" onClick={() => decrementQuantity(product._id)}>-</p>
                                                <span>{cart.find(item => item.id === product._id).quantity || 1}</span>
                                                <p className="quantity-btn center" onClick={() => incrementQuantity(product._id)}>+</p>
                                            </div>
                                        ) : (
                                            <div className="add-to-cart center">
                                                <button onClick={() => addToCart(product)}>Add</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </InfiniteScroll>
                    {cart.length > 0 && (
                        <div className="proceed-container" onClick={proceedToCheckout}>
                            <p className='center'>{cart.length} {cart.length > 1 ? 'items' : 'item'} added <FaCircleArrowRight /></p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products;
