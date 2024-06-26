import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/load-animation.json';

const Loader = () => {
    const defaultOptions = {
        loop: true, // Set loop to false to play animation only once
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='center' style={{ height: '80dvh' }}>
            <Lottie
                options={defaultOptions}
                height={200}
                width={200}
            />
        </div>
    );
};

export default Loader;
