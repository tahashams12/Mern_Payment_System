import * as http from "http";
import { pgH,pgS } from "./routes/pgHS.js";
import { createpaymentIntent } from "./routes/apiPG.js";
import {rootpgH,rootpgS} from "./routes/rootPageH_S.js";
import { SendmailTransport } from "./routes/rootPage.js";
import { connectToDatabase } from "./config/dbConfig.js";
import url from "url";
import session from "express-session";
const dbConnection = connectToDatabase();
const sessionMiddleware = session({
    secret: "tahaali@2525",
    resave: false,
    saveUninitialized: false,
  });
import { handleLogin } from "./routes/handleLogin.js";
  

const requestListener = (req, res) => {
// Parse the URL
const parsedUrl = url.parse(req.url, true);


sessionMiddleware(req, res, () => {
    if (req.url === "/pg.html" && req.method === "GET") {
        pgH(req,res);
    } 
    else if(req.url=="/pg.js" && req.method=='GET'){
        pgS(req,res);
    }
    else if(req.url=="/create-payment-intent" && req.method=='POST'){
        console.log("create-payment-intent");
        createpaymentIntent(req,res,dbConnection);
    }
    else if(req.url=="/" && req.method=='GET'){
        rootpgH(req,res);
    }
    else if(req.url=="/rootPage.js" && req.method=='GET'){
        rootpgS(req,res);
    }
    else if(req.url=="/sendmail" && req.method=='POST'){
        SendmailTransport(req,res,dbConnection);
    }
    else if(parsedUrl.pathname=="/login" && req.method=='GET'){
        const {token}=parsedUrl.query;
        handleLogin(req,res,dbConnection,token);
    }
    else if(req.url=="/welcomePage.html" && req.method=='GET'){
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("Welcome to the welcome page");
    }
    else {
        res.writeHead(404);
        res.end("Not Found");
    }
});
};

// Create and start the server
const server = http.createServer(requestListener);

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
