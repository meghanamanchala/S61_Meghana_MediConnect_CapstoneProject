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
  const amount = patientDetails?.amount ?? 0;
  const patientName = patientDetails
    ? `${patientDetails.firstName} ${patientDetails.lastName}`
    : 'Patient';
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
          name: patientName,
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
    <div className='payment-page'>
      <div className="payment-shell">
        <div className="payment-summary-card">
          <p className="payment-badge">Secure Checkout</p>
          <h2 className="payment-title">Confirm Appointment Payment</h2>
          <p className="payment-instructions">
            Review your details and complete the transaction securely.
          </p>

          <div className="payment-summary-list">
            <div className="summary-row">
              <span>Patient</span>
              <strong>{patientName}</strong>
            </div>
            <div className="summary-row">
              <span>Payment Method</span>
              <strong>Credit / Debit Card</strong>
            </div>
            <div className="summary-row amount-row">
              <span>Total Amount</span>
              <strong>₹{amount}</strong>
            </div>
          </div>

          <p className="payment-note">You will be redirected to the home page once payment is successful.</p>
        </div>

        <div className="payment-form-card">
          <form onSubmit={handleSubmit} className="payment-form">
            <label className="card-label">Card Details</label>
            <CardElement className="card-element" />

            <button type="submit" disabled={!stripe || isLoading || !clientSecret} className="pay-button">
              {isLoading ? 'Processing...' : `Pay ₹${amount}`}
            </button>

            {paymentStatus && (
              <div className={`payment-status ${paymentStatus.includes('succeeded') ? 'success' : 'error'}`}>
                {paymentStatus}
              </div>
            )}

            {!clientSecret && (
              <div className="payment-status error">
                Payment session is missing. Please restart the booking flow.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;
