import * as http from "http";
import { pgH,pgS } from "./routes/pgHS.js";
import { createpaymentIntent } from "./routes/apiPG.js";

const requestListener = (req, res) => {

    if (req.url === "/pg.html" && req.method === "GET") {
        pgH(req,res);
    } 
    else if(req.url=="/pg.js" && req.method=='GET'){
        pgS(req,res);
    }
    else if(req.url="/create-payment-intent" && req.method=='POST'){
        createpaymentIntent(req,res);
    }
    else {
        res.writeHead(404);
        res.end("Not Found");
    }
};

// Create and start the server
const server = http.createServer(requestListener);

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
