import * as fs from "fs";
const path_H = "C:/xampp/htdocs/Mern-Proj(fron-end)/Payment_System/src/pg.html";
const path_S = "C:/xampp/htdocs/Mern-Proj(fron-end)/Payment_System/src/pg.js";



export const pgH = (req, res) => {
if(req.session.email===undefined || req.session.user_ip===undefined || req.session.user_agent===undefined){
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
    console.log("Unauthorized");
    return;
}


  fs.readFile(path_H, (err, data) => {
    if (err) {
      console.log("Error Reading HTML File OF User Mark Leave Page!!", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  });
};

export const pgS = (req, res) => {
  if(req.session.email===undefined || req.session.user_ip===undefined || req.session.user_agent===undefined){
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Unauthorized" }));
    console.log("Unauthorized");
    return;
}
  fs.readFile(path_S, (err, data) => {
    if (err) {
      console.log("Error Reading JS File OF User Mark Leave Page!!", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.write(data);
    res.end();
  });
};
