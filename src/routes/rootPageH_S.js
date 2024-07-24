import * as fs from "fs";
const path_H = "C:/xampp/htdocs/Mern-Proj(fron-end)/Payment_System/src/rootPage.html";
const path_S = "C:/xampp/htdocs/Mern-Proj(fron-end)/Payment_System/src/rootPage.js";

export const rootpgH = (req, res) => {

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

export const rootpgS = (req, res) => {
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
