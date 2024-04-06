import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/product.scss';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { FaCircleArrowRight } from "react-icons/fa6";

const Products = () => {

    const baseURL = import.meta.env.VITE_BASE_URL
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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
                setTotalPages(response.data.total_pages);
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
    }, [id, currentPage]);

    const handlePagination = (page) => {
        setCurrentPage(page);
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

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
                // If quantity becomes zero or negative, remove the item from the cart
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

    return (
        <div className="product-container" style={{ marginBottom: cart.length > 0 ? '60px' : '0px' }}>
            <h1>{shopName}</h1>
            <h3>Our Menu</h3>
            {loading ? (
                <div className="loader-main">
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <>
                    <div className="product-cards">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <div className="card-details center">
                                    <h3>{product.name}</h3>
                                    <p>₹{product.sellingPrice}</p>
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
                    <div className="pagination center">
                        <button onClick={() => goToFirstPage()} disabled={currentPage === 1} className="center">
                            <MdKeyboardDoubleArrowLeft />
                        </button>
                        <button onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 1} className="center">
                            <IoIosArrowBack />
                        </button>
                        <span>{currentPage} of {totalPages}</span>
                        <button onClick={() => handlePagination(currentPage + 1)} disabled={currentPage === totalPages} className="center">
                            <IoIosArrowForward />
                        </button>
                        <button onClick={() => goToLastPage()} disabled={currentPage === totalPages} className="center">
                            <MdKeyboardDoubleArrowRight />
                        </button>
                    </div>
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
