import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const Payment = (props) => {

    const application = props.application;
    console.log('application ', application)
    const processPayment = () => {
        console.log('processPayment')
        const info = {
            amount: 100,
            name: 'shihab',
            applicationId: application?._id
        }
        fetch('http://localhost:5000/api/v1/payment/ssl-init', {
            method: 'post',
            // { redirect: 'follow', 'content-type': 'Access-Control-Allow-Origin' }
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
            body: JSON.stringify(info)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                window.location.replace(data)
            })
    }

    return (
        <>
            <div className='text-center'>
                <h2>Payment View</h2>
                <Button variant='warning'
                    onClick={() => {
                        processPayment();
                    }}>
                    Pay
                </Button>
            </div>
        </>

    );
};

export default Payment;