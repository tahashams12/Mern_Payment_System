const handleMail = async (event) => {
    event.preventDefault();
    const email = document.getElementById('toEmail').value;
    try {
        const response = await fetch('/sendmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: email,
            })
        });
        const data = await response.text();
        alert(data);
    } catch (err) {
        console.error(err);
        alert('An error occurred. Please try again.');
    }
};
document.getElementById('emailForm').addEventListener('submit',handleMail);



