import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export async function createpaymentIntent(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { paymentMethodId, amount } = JSON.parse(body);

            // Create a Payment Intent with return_url
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount, // Amount in cents
                currency: 'usd',
                payment_method: paymentMethodId,
                confirm: true,
                return_url: 'https://google.com/' // Specify the return URL here
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, paymentIntent }));
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: error.message }));
        }
    });
}
