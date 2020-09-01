import { body, validationResult } from 'express-validator';
import Subscriber from '../models/subscriber';

exports.addSubscriber = [
  body('email')
    .isEmail()
    .withMessage('Type in an actual email')
    .normalizeEmail(),
  async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({
        errors: errors.array(),
      });
    } else {
      try {
        const { email } = req.body;
        const subscriber = new Subscriber({
          email,
        });
        subscriber.save((err) => {
          if (err) {
            return res.status(500).send({
              message: err.message,
            });
          }
          res.status(201).send({
            success: 'user added to subscribers list',
          });
        });
      } catch (err) {
        res.status(400).send(err);
      }
    }
  },
];

exports.getAllSubscribers = (req, res) => Subscriber.find({}, (err, subscribers) => {
  if (err) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
  res.status(200).send({
    status: 200,
    subscribers,
  });
});
