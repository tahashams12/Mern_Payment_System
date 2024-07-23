const payAmnt = 2000; // Amount in cents
let stripe, card;

const initStripe = () => {
    stripe = Stripe('pk_test_51PYaxBKWQhATfha0ZGw2UcZB6OumXjJRh2MJIlpQbQJfQrDZoNQmnToqXHLjPuQZOHk4LZAt9UZV4Dlxse3GIXfL00akmAHl15');

    const payableAmnt = document.getElementById('payableAmnt');
    payableAmnt.textContent = `Pay $${payAmnt / 100}`;

    const elements = stripe.elements();
    card = elements.create('card');
    card.mount('#card-element');
};

const handlePayment = async (event) => {
    event.preventDefault();

    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
    });

    const errorElement = document.getElementById('card-errors');

    if (error) {
        errorElement.textContent = error.message;
        return;
    }

    try {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentMethodId: paymentMethod.id,
                amount: payAmnt
            })
        });

        const data = await response.json();
       if(data.success){
        alert('Payment successful');
        window.location.href="http://localhost:3000/pg.html";
       }else{
        alert('Payment failed. Please try again.');
       }
    } catch (err) {
        console.error(err);
        alert('An error occurred. Please try again.');
    }
};

document.getElementById('payment-form').addEventListener('submit', handlePayment);
document.addEventListener('DOMContentLoaded', initStripe);
