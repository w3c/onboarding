"use strict";
const nodemailer = require("nodemailer");

function email(options) {
  console.log("[Email] To:" + options.to + " Subject: " + options.subject);

  const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
  });
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve({options, info});
      }
    });
  });
}

exports.email = email;