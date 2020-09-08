import nodemailer from 'nodemailer';
import Subscriber from '../models/subscriber';

const allSubscribers = async () => {
  const subscribers = await Subscriber.find();
  if (!subscribers) {
    return;
  }
  return subscribers.map(subscriber => subscriber.email);
};

const transporter = nodemailer.createTransport({
  service: 'Sendgrid',
  auth: {
    user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD,
  },
});

exports.sendNewCommentNotificationEmail = async (username, message, postTitle, postId) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.SENDGRID_USERNAME,
    subject: 'New Comment',
    html: `<div>
        <p>Hi,</p>
        <p>${username} just made the following comment on the post '${postTitle}'. </p>
        <p style={{ marginLeft: "12px"}}>"${message}"</>
        <p>You can view the comment <a href=https://marblesofhameedah.rocks/post/${postId}>here</a></p>
        </div>`,
  };
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.sendNewPostNotificationEmail = async (postTitle, postId) => {
  const mailList = await allSubscribers();
  mailList.forEach((subscriber) => {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: subscriber,
      subject: 'New Post on Meedah\'s Marbles',
      html: `<div>
      <p>Hello Dear Reader,</p>
      <p>I have just published the post '${postTitle}'. </p>
      <p>You can check it out <a href=https://marblesofhameedah.rock/post/${postId}>here</a></p>
      </div>`,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};
