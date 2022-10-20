import React from 'react';
import { useHistory } from 'react-router-dom';
import NavigationBar from '../Navigationbar/NavigationBar';

const NotFound = () => {
    const history = useHistory();

    const redirectHome = () => {
        history.push("/home");
    }

    // const imgSrc = "https://i.ibb.co/rcFhb9m/not-found-1.png"

    return (
        <div>
            <NavigationBar></NavigationBar>
            <div className='text-center my-5 mx-auto'>
                <img className="img-fluid w-50" src="https://i.ibb.co/s9ypWLT/not-found.webp" alt="notFound" /><br />
                <button className="btn btn-lg btn-danger text-white" onClick={redirectHome}>Go Home</button>
            </div>
        </div>

    );
};

export default NotFound;