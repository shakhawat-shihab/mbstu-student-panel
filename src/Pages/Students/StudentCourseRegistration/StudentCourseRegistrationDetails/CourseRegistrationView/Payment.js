import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
const stripePromise = loadStripe('pk_test_51Kpnq6JmlJsO1FghhmfVHTrBjRtusmHHRlpxnxB9qrfYytcOTiyXaWP9y0BwHCRIqB15BV94yETiN677dhvwcpXE00FL3CpyUK');

const Payment = (props) => {
    const [show, setShow] = useState(false);
    const { application } = props;
    const amount = 10;

    return (
        <>
            <Modal
                show={show}
                onHide={() => { setShow(false) }}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Complete your payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Total Amount {amount} $
                    {
                        amount
                            ?
                            <Elements stripe={stripePromise}>
                                <CheckoutForm application={application} />
                            </Elements>
                            :
                            <p>Payment can't be processed now</p>
                    }
                </Modal.Body>


            </Modal>
            <div className='text-center'>
                <h2>Payment View</h2>
                <Button variant='warning' onClick={() => setShow(true)}>Pay</Button>
            </div>
        </>

    );
};

export default Payment;