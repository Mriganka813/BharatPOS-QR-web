import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/error-animation.json';

const Error = () => {
    const defaultOptions = {
        loop: false, // Set loop to false to play animation only once
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='center'style={{ height: '80dvh' }}>
            <Lottie
                options={defaultOptions}
                height={400}
                width={400}
            />
        </div>
    );
};

export default Error;
