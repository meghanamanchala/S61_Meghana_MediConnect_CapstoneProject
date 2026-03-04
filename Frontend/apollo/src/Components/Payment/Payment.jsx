// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useLocation ,useNavigate} from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './Payment.css';

function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate(); 
  const { clientSecret, patientDetails } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${patientDetails.firstName} ${patientDetails.lastName}`,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setPaymentStatus('Payment failed: ' + error.message);
    } else {
      if (paymentIntent.status === 'succeeded') {
        setPaymentStatus('Payment succeeded!');
      } else {
        setPaymentStatus('Payment failed: ' + paymentIntent.status);
      }
    }
  };
  useEffect(() => {
    if (paymentStatus.includes('succeeded')) {
      const timer = setTimeout(() => {
        navigate('/'); 
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [paymentStatus, navigate]);

  // 4000 0027 6000 3184 - Card Number
  
  return (
    <div className='payment-box'>
    <div className="payment-container">
      <h2 className="payment-title">Complete Your Payment</h2>
      <p className="payment-instructions">
        Please enter your card details below to complete the payment of ₹{patientDetails.amount} for your appointment.
      </p>
      <form onSubmit={handleSubmit} className="payment-form">
        <CardElement className="card-element" />
        <button type="submit" disabled={!stripe || isLoading} className="pay-button">
          {isLoading ? 'Processing...' : 'Pay with Card'}
        </button>
        <div className={`payment-status ${paymentStatus.includes('succeeded') ? 'success' : 'error'}`}>
          {paymentStatus}
        </div>
      </form>
    </div>
    </div>
  );
}

export default Payment;
