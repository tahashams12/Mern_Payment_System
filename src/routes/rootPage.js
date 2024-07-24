import * as nodemailer from "nodemailer";
import * as crypto from "crypto";

function generateRandomToken(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

const token = generateRandomToken();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "privatetshams@gmail.com",
    pass: "qagg ymag zmob czye",
  },
});

export const SendmailTransport = (req, res, dbConnection) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => { // Use "end" event instead of "data"
    const {to} = JSON.parse(body);
    const text="Login Using This Link!!";
    const subject = "Login link"; // Set the subject to "Login link
    const token = generateRandomToken();
    sendEmail(to, subject, text, token); // Pass the token to sendEmail
    res.end("Email sent");
    tokenInsert(dbConnection, to, token,req); // Pass the token to tokenInsert
  });
};

function tokenInsert(dbConnection, email, token,req) {
  dbConnection.query(
    `SELECT * FROM login_tokens WHERE email='${email}'`,
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      if (result.length > 0) {
        dbConnection.query(
          `UPDATE login_tokens SET token='${token}', user_ip='${req.connection.remoteAddress}', user_agent='${req.headers['user-agent']}' WHERE email='${email}'`,
          (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Token updated");
          }
        );
      } else {
        dbConnection.query(
          `INSERT INTO login_tokens(email,token,user_ip,user_agent) VALUES('${email}','${token}','${req.connection.remoteAddress}','${req.headers['user-agent']}')`,
          (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Token inserted");
          }
        );
      }
    }
  );

}

async function sendEmail(to, subject, text, token) {
  const loginLink = `http://localhost:3000/login?token=${token}`; // Replace with your actual domain and endpoint
  const emailText = `${text}\n\nPlease click the following link to log in: ${loginLink}`;

  try {
    let info = await transporter.sendMail({
      from: '"Taha-Shams" <tahaalishams@gmail.com>',
      to: to,
      subject: subject,
      text: emailText, // Include the login link in the email
    });
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
