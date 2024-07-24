import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export async function createpaymentIntent(req, res,dbConnection) {
    if (
        req.session.email === undefined ||
        req.session.user_ip === undefined ||
        req.session.user_agent === undefined
    ) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        console.log('Unauthorized');
        return;
    }
console.log("email is",req.session.email);
    let body = '';

    req.on('data', (chunk) => {
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
                return_url: 'http://localhost:3000/welcomePage.html', // Specify the return URL here
            });

            const paymentDetails = {
                // Payment details to be inserted in the database
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                token: paymentIntent.id, // Payment Intent ID as a token
                description: paymentIntent.description || 'No description',
                status: paymentIntent.status,
                id: paymentIntent.id,
                email: req.session.email,
            };

            insertPaymentDetails(dbConnection, paymentDetails, req);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, paymentIntent }));
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: error.message }));
        }
    });
}

function insertPaymentDetails(dbConnection, paymentDetails, req) {
    const email = req.session.email;

    dbConnection.query(
        `INSERT INTO transactions(amount, currency, token, description, status, id, email) VALUES('${paymentDetails.amount}', '${paymentDetails.currency}', '${paymentDetails.token}', '${paymentDetails.description}', '${paymentDetails.status}', '${paymentDetails.id}', '${email}')`,
        (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Payment details inserted');
        }
    );
}
