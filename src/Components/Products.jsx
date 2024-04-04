// Import necessary components and icons
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/product.scss';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { FaCircleArrowRight } from "react-icons/fa6";

const Products = () => {

    const baseURL = "https://bharatpos-web-test.onrender.com"

    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseURL}/api/v1/consumer/sellerProduct/${id}?page=${currentPage}`);
                console.log(`${baseURL}/api/v1/consumer/sellerProduct/${id}?page=${currentPage}`)
                setProducts(response.data.data);
                setTotalPages(response.data.total_pages);
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
        const quantity = quantities[product._id] || 1;
        const itemDetails = {
            price: product.sellingPrice,
            quantity: quantity,
            product: product,
            saleCGST: product.saleCGST,
            saleSGST: product.saleSGST,
            saleIGST: product.saleIGST,
            baseSellingPrice: product.baseSellingPrice,
            discountAmt: product.discountAmt,
            originalbaseSellingPrice: product.originalbaseSellingPrice
        };
        setCart([...cart, itemDetails]);
        console.log(cart);
    };

    const incrementQuantity = (productId) => {
        setQuantities({ ...quantities, [productId]: (quantities[productId] || 0) + 1 });
    };

    const decrementQuantity = (productId) => {
        if (quantities[productId] > 0) {
            const updatedQuantity = quantities[productId] - 1;
            setQuantities({ ...quantities, [productId]: updatedQuantity });
            if (updatedQuantity === 0) {
                // Remove the item from the cart
                setCart(cart.filter(item => item.product._id !== productId));
            }
        }
    };

    const proceedToCheckout = () => {
        console.log(cart);
    };

    return (
        <div className="product-container" style={{ marginBottom: cart.length > 0 ? '70px' : '0px' }}>
            <h1>
                {products.length > 0 ? products[0].sellerName : "Products"}
            </h1>
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
                                    {cart.some(item => item.product._id === product._id) ? (
                                        <div className="add-to-cart center quantity-control">
                                            <p className="quantity-btn center" onClick={() => decrementQuantity(product._id)}>-</p>
                                            <span>{quantities[product._id] || 1}</span>
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
