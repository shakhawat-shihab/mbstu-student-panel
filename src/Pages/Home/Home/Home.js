import React from 'react';
// import Banner from '../../Shared/Banner/Banner';
// import Header from '../../Shared/Header/Header';
import NavigationBar from '../../Shared/Navigationbar/NavigationBar';
// import NavigBar from '../../Shared/NavigBar/NavigBar';
// import Counter from '../Counter/Counter';
import Slider from '../Slider/Slider';


const Home = () => {
    return (
        <div>
            {/* <Header></Header> */}
            {/* <Banner></Banner> */}
            <NavigationBar></NavigationBar>
            {/* <h2>hi {process.env.REACT_APP_KEY}</h2> */}
            {/* <NavigBar></NavigBar> */}
            <Slider></Slider>
            <br></br>
            {/* <Counter></Counter> */}
        </div>
    );
};

export default Home;