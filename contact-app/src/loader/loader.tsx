import React from 'react';
import './loader.scss'; // Make sure you import your CSS file here

const loader: React.FC = () => {
    return (
        <div className="overlay">
            <div className="overlay__inner">
                <div className="overlay__content">
                    <span className="lds-hourglass"></span>
                </div>
            </div>
        </div>
    );
}

export default loader;
