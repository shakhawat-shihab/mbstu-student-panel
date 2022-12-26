import { CardElement, CardNumberElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import useAuth from '../../../../../Hooks/useAuth';


const CheckoutForm = (props) => {
    const { applicantName, _id, amount } = props.application;
    const setApplicationView = props.setApplicationView;
    const { user } = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    console.log(props.application);

    useEffect(() => {
        fetch('https://mbstu-panel-server.onrender.com/api/v1/payment/create-payment-intent', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
            body: JSON.stringify({ price: 50 })
        })
            .then(res => res.json())
            .then(info => {
                console.log('data === ',);
                console.log('info === ', info);
                setClientSecret(info?.data);
            })
    }, [amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submitting')
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }
        setProcessing(true);
        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error] ', error);
            setError(error.message);
        } else {
            console.log('[PaymentMethod] ', paymentMethod);
            setError('');
        }
        console.log('clientSecret ', clientSecret)

        const { paymentIntent, error: intentError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: applicantName,
                        // email: 
                    },
                },
            },
        );


        if (intentError) {
            setError(intentError.message);
            setSuccess('');
        }
        else {
            setError('');
            setSuccess('Your payment processed successfully.')
            console.log('paymentIntent =', paymentIntent);
            setProcessing(false);
            // save to database
            const payment = {
                applicationId: _id,
                amount: paymentIntent.amount,
                paymentTime: paymentIntent.created,
                last4: paymentMethod.card.last4,
                transaction: paymentIntent.client_secret.split('_')[1]
            }
            console.log('save to db ', payment)
            fetch(`https://mbstu-panel-server.onrender.com/api/v1/payment/create-payment`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                },
                body: JSON.stringify(payment)
            })
                .then(res => res.json())
                .then(data => console.log(data));
        }
    }
    return (
        <div>
            {/* <h2>Hello Stripe</h2> */}
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />

                {
                    processing
                        ?
                        <Spinner />
                        :
                        <button type="submit" disabled={!stripe || success}>
                            Pay ${amount}
                        </button>
                }

            </form>
            {
                error && <p style={{ color: 'red' }}>{error}</p>
            }
            {
                success && <p style={{ color: 'green' }}>{success}</p>
            }
        </div>
    );
};

export default CheckoutForm;