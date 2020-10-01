"use strict";

const express = require("express");
const attendant = require ("./flight-attendant");
const bodyParser = require("body-parser");
const { nextTick } = require("process");
const app = express();
const env = require('dotenv').config({path: __dirname + '/.env'});
const PORT = process.env['PORT'] || 3000;
const WEBHOOK_URL = process.env['WEBHOOK_URL'];

app.use(bodyParser.json());

var jsonParser = bodyParser.json();
app.post("/onboard", jsonParser, (req, res, next) => {
    if (process.env.NODE_ENV == 'debug'){
      console.log(req.headers);
    }
    if (req.header('x-w3c-webhook') == WEBHOOK_URL){
      if (req.body.event == "group.participant_joined"){
        try {
          attendant.welcome(req.body.user.id, req.body.user.name, req.body.group.id, 
            function (err, result) {
              if (err){
                res.status(500).end();
              }
              res.status(200).end()});
        }
        catch (err){
          console.log(err);
          res.status(400).end();
        }
      }  else { 
        if (process.env.NODE_ENV == 'debug'){
          console.log ("not a join event ");
        }
        // do nothing on 'left' events
        res.status(200).end();
      }
    } else {
      console.log('unexpected or forbidden post from '+  (req.headers['x-forwarded-for'] || req.connection.remoteAddress));
      res.status(403).end();
    }
    next;
  });

  app.listen(PORT, () => {
    console.log("Server listening on port %d in %s mode", PORT, process.env.NODE_ENV);
    }
  );
