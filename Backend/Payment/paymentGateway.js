const express = require('express');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;
const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).send('Stripe is not configured');
      }

      const { amount } = req.body;
  
      if (!amount) {
        return res.status(400).send('Amount is required');
      }
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount*100 ,
        currency: 'inr',
        payment_method_types: ['card'],
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
