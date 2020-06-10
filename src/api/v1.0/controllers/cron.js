import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

exports.sendMail = async (req, res) => {
  try {
    const info = fetch('http://quotes.rest/qod.json?category=love')
      .then(response => response.json())
      .catch(err => console.log(err));
    info.then((results) => {
      const data = results.contents.quotes.map(result => result.quote);
      console.log(data);
      let message = '';
      for (let i = 0; i < data.length; i++) {
        message += `${data[i]}!  `;
      }
      const transporter = nodemailer.createTransport({
        service: 'Sendgrid',
        auth: {
          user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD,
        },
      });
      transporter.sendMail({ // email options
        from: `Ibrahim <${process.env.CRON_EMAIL}>`,
        to: 'Lover <praisesubtle@gmail.com>', // receiver
        subject: 'My Daily Love Snippet', // subject
        html: `<div>
                  <h2>Hello Love,</h2>
                  <h6>${message}</h6>
                  <p>What do you think?</p>
                  </div>`, // body (var data which we've declared)
      }, (error, response) => { // callback
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent');
          res.status(200).send({ message: 'message sent successfully' });
        }
      });
    });
  } catch (err) {
    res.status(400).send(err);
  }
};
