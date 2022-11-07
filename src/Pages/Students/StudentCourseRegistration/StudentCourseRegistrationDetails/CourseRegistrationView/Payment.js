import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { Redirect, useHistory } from 'react-router-dom';
const stripePromise = loadStripe('pk_test_51Kpnq6JmlJsO1FghhmfVHTrBjRtusmHHRlpxnxB9qrfYytcOTiyXaWP9y0BwHCRIqB15BV94yETiN677dhvwcpXE00FL3CpyUK');

const Payment = (props) => {
    const [show, setShow] = useState(false);
    const { application } = props;
    const history = useHistory();
    const amount = 10;
    const processPayment = () => {
        console.log('processPayment')
        fetch('http://localhost:5000/api/v1/payment/ssl-init', {
            method: 'put',
            // { redirect: 'follow', 'content-type': 'Access-Control-Allow-Origin' }
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        }
        )
            .then(res => res.json())
            .then(info => {
                console.log('message ==> ', info);
                window.location.href = info.url;
            })
    }

    return (
        <>
            <div className='text-center'>
                <h2>Payment View</h2>
                <Button variant='warning'
                    onClick={() => {
                        // setShow(true)
                        processPayment();
                    }}>
                    Pay
                </Button>
            </div>
        </>

    );
};

export default Payment;