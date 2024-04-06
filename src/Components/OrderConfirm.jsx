import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/lottie-animation.json';

const OrderConfirm = () => {
    const defaultOptions = {
        loop: false, // Set loop to false to play animation only once
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='center' style={{ height: '100dvh' }}>
            <Lottie
                options={defaultOptions}
                height={400} // Adjust the height and width as needed
                width={400}
            />
        </div>
    );
};

export default OrderConfirm;
