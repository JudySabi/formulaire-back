require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(formidable());

const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
  res.send("Server Started");
});

app.post("/", (req, res) => {
  const { firstname, lastname, email, subject, message } = req.fields;
  /* CREATION DE L'OBJET DATA */
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "julie.mahe.pro@gmail.com",
    subject: subject,
    text: message,
  };
  /* ENVOI DE L'OBJET VIA MAILGUN */
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.status(200).json(body);
    } else {
      res.status(401).json(error);
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log("Le serveur a bien démarré");
});
