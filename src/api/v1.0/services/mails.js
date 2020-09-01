import nodemailer from 'nodemailer';
import Subscriber from '../models/subscriber';

const allSubscribers = async () => {
  const subscribers = await Subscriber.find()
    if (!subscribers) {
      return
    }
    return subscribers.map((subscriber) => subscriber.email)
}

exports.sendNewCommentNotificationEmail = async (username, message, postTitle, postId, req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'Sendgrid',
      auth: {
        user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.CRON_EMAIL,
      to: process.env.CRON_EMAIL_RECIPIENT,
      subject: 'New Comment',
      html: `<div>
        <p>Hi,</p>
        <p>${username} just made the following comment on the post '${postTitle}'. </p>
        <p style={{ marginLeft: "12px"}}>"${message}"</>
        <p>You can view the comment <a href=https://marblesofhameedah.rock/post/${postId}>here</a></p>
        </div>`,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.status(201).send({ message: `A comment notification email has been sent.` });
    });
};

exports.sendNewPostNotificationEmail = async (postTitle, postId, res) => {
  const transporter = nodemailer.createTransport({
    service: 'Sendgrid',
    auth: {
      user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD,
    },
  });
  const mailList = await allSubscribers()
  mailList.forEach((subscriber) => {
  const mailOptions = {
    from: process.env.CRON_EMAIL,
    to: subscriber,
    subject: `New Post on Meedah's Marbles`,
    html: `<div>
      <p>Hello Dear Reader,</p>
      <p>I have just published the post '${postTitle}'. </p>
      <p>You can check it out <a href=https://marblesofhameedah.rock/post/${postId}>here</a></p>
      </div>`,
  };
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send({ message: err.message });
    }
    res.status(201).send({ message: `A comment notification email has been sent.` });
  })
})
};
