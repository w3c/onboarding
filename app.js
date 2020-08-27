const express = require("express");
const attendant = require ("./flight-attendant");
const bodyParser = require("body-parser");
const { nextTick } = require("process");
//const { read } = require("fs");

const app = express();
const PORT = 3000;
const WEBHOOK_URL = 'https://www.w3.org/users/31823/webhooks/237';


app.use(bodyParser.json());
var jsonParser = bodyParser.json();
app.post("/onboard", jsonParser, (req, res) => {
    console.log(req.headers);
    if (req.header('x-w3c-webhook') == WEBHOOK_URL){
      var userid = req.body.user.id;
      var groupid = req.body.group.id;
      attendant.welcome(userid, groupid);
      res.status(200).end();
    } else {
      console.log('unexpected or forbidden post from '+  (req.headers['x-forwarded-for'] || req.connection.remoteAddress));
      res.status(403).end();
    }
  });


  app.listen(PORT, () => {
    console.log("Server listening on port %d in %s mode", PORT, process.env.NODE_ENV);
    }
  );
