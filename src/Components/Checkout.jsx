import { useEffect, useState } from 'react';
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import '../styles/checkout.scss';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState('');

    const handleChange = (event) => {
        setTableNumber(event.target.value);
    };

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            setCart(savedCart);
        }
    }, []);

    console.log(cart);

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
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
            // Remove the item from the cart if quantity is 0
            updatedCart.splice(index, 1);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
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
                                <p>₹
                                    {
                                        item.price * item.quantity
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="table-no-input">
                <p>
                    Table No.
                </p>
                <input
                    type="text"
                    placeholder="Enter your table number"
                    value={tableNumber}
                    onChange={handleChange}
                />
            </div>

            <div className="proceed-container">
                <p className='center'>
                    Complete Order <MdOutlineShoppingCartCheckout />
                </p>
            </div>

        </div>
    );
};

export default Checkout;
