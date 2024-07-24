export function handleLogin(req, res, dbConnection, token) {
    if (!isTokenValid(token)) {
        console.log("send");
        sendUnauthorizedResponse(res);
        return;
    }

    verifyToken(req, dbConnection, token, (err, email) => {
        if (err) {
            console.error(err);
            setTokenNull(token, dbConnection);
            sendInternalServerErrorResponse(res);
            return;
        }

        if (email) {
            checkUserPayment(email, dbConnection, (err, hasPaid) => {
                if (err) {
                    console.error(err);
                    setTokenNull(token, dbConnection);
                    sendInternalServerErrorResponse(res);
                    return;
                }

                if (hasPaid) {
                    setupSession(req, email);
                    setTokenNull(token, dbConnection);
                    sendAuthorizedResponse(res);
                } else {
                    setupSession(req, email);
                    setTokenNull(token, dbConnection);
                    sendPaymentRequiredResponse(res);
                }
            });
        } else {
            setTokenNull(token, dbConnection);
            sendUnauthorizedResponse(res);
        }
    });
}

function isTokenValid(token) {
    return token !== null && token !== undefined;
}

function verifyToken(req, dbConnection, token, callback) {
    const query = `
        SELECT email FROM login_tokens 
        WHERE token='${token}' 
        AND user_ip='${req.connection.remoteAddress}' 
        AND user_agent='${req.headers['user-agent']}'`;

    dbConnection.query(query, (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            const email = result.length > 0 ? result[0].email : null;
            callback(null, email);
        }
    });
}

function checkUserPayment(email, dbConnection, callback) {
    const query = `
        SELECT * FROM transactions 
        WHERE email='${email}' AND status='succeeded'`;

    dbConnection.query(query, (err, transactions) => {
        if (err) {
            callback(err, false);
        } else {
            const hasPaid = transactions.length > 0;
            callback(null, hasPaid);
        }
    });
}

function setupSession(req, email) {
    req.session.email = email;
    req.session.user_ip = req.connection.remoteAddress;
    req.session.user_agent = req.headers['user-agent'];
}

function setTokenNull(token, dbConnection) {
    const query = `UPDATE login_tokens SET token=null WHERE token='${token}'`;

    dbConnection.query(query, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Token updated");
        }
    });
}

function sendUnauthorizedResponse(res) {
    console.log("send un auth res");
    
    res.writeHead(302, { 
        'Location': 'http://localhost:3000/',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
    });
    res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
}

function sendInternalServerErrorResponse(res) {
    console.log("send err res");
    
    res.writeHead(302, { 
        'Location': 'http://localhost:3000/',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        
    });
    res.end(JSON.stringify({ success: false, message: "Internal Server Error" }));
}

function sendPaymentRequiredResponse(res) {
    console.log("Payment Required");
    res.writeHead(302, { 
        'Location': 'http://localhost:3000/pg.html',
        'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ success: false, message: "Payment Required" }));
}

function sendAuthorizedResponse(res) {
    console.log("send auth res");

    res.writeHead(302, { 
        'Location': 'http://localhost:3000/welcomePage.html',
        'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ success: true, message: "Authorized and Paid" }));
}
