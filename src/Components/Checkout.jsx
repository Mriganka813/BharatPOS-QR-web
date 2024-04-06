import { useEffect, useState } from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import '../styles/checkout.scss';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState();

    const handleChange = (event) => {
        setTableNumber(event.target.value);
    };

    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        const savedPhone = JSON.parse(localStorage.getItem('phoneNumber'));
        if (!savedCart || !savedPhone) {
            navigate("/")
        }
        if (savedCart) {
            setCart(savedCart);
            setPhoneNumber(savedPhone);
        }
    }, []);

    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity++;
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity--;
        } else {
            // Remove the item from the cart if quantity is 0
            updatedCart.splice(index, 1);
        }
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        if (updatedCart.length === 0) {
            navigate("/");
        }
    };

    // Function to calculate the total price of items in the cart
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    const handleConfirm = () => {

        if (!tableNumber) {
            toast('Provide table number first', {
                icon: '⚠️',
            });
            return;
        }

        // Define an async function that returns a promise
        const confirmOrderPromise = () => {
            return axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/qrOrder/new`, {
                orderItems: cart,
                tableNo: tableNumber,
                phoneNumber: phoneNumber
            }).then(response => response.data);
        };

        // Show toast using toast.promise
        toast.promise(
            confirmOrderPromise(),
            {
                loading: 'Confirming order...',
                success: (data) => {
                    navigate('/confirmation');
                    localStorage.removeItem('cart');
                    localStorage.removeItem('phoneNumber');
                    return 'Order confirmed successfully!';
                },
                error: 'Failed to confirm order'
            }
        );
    };

    return (
        <div className="checkout-container">
            <h2>Cart</h2>

            <div className='card-container-main'>
                {cart.map((item, index) => (
                    <div key={index} className='cart-card center'>
                        <div className="cart-card-1 ca-details center">
                            <h3>{item.product.name}</h3>
                            <p>₹{item.price}</p>
                        </div>
                        <div className="cart-card-1 center">
                            <div className="quantity-management center">
                                <button onClick={() => decreaseQuantity(index)}>-</button>
                                <p>{item.quantity}</p>
                                <button onClick={() => increaseQuantity(index)}>+</button>
                            </div>
                            <div className="total-item-price">
                                <p>₹{item.price * item.quantity}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="cart-total center">
                    <p>Total: ₹{calculateTotal()}</p>
                </div>
            </div>

            <div className="table-no-input">
                <p>Table Number</p>
                <input
                    type="text"
                    placeholder="Enter your table number"
                    value={tableNumber}
                    onChange={handleChange}
                />
            </div>

            <div className="proceed-container" onClick={handleConfirm}>
                <p className='center'>
                    Confirm <FaArrowRightLong />
                </p>
            </div>

        </div>
    );
};

export default Checkout;
