import React from 'react';
import "./Banner.css";

const Banner = () => {
    const logoSrc = "https://i.ibb.co/QMbh6wz/mbstu-logo.png";
    return (
        <div className="banner-bg">
            <div className="container">
                <div className="banner-position py-2">

                    <div className="img-pos">
                        <img src={logoSrc} style={{ width: "100px" }} className="img-fluid pb-2" alt="mbstu_logo" />
                    </div>

                    <div className="img-pos pt-3 ps-1 ms-3">
                        <p className="fs-1 fw-bolder">Mawlana Bhashani Science and Technology University</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Banner;