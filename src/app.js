import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import logger from 'morgan';
import cors from 'cors';
// import { CronJob } from 'cron';
// import { sendMail } from './api/v1.0/controllers/cron';
// import { sendMail }from '../cron'
import testAPIRouter from './api/v1.0/routes/index';

require('./api/v1.0/models/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());
app.use(session({
  key: 'token',
  secret: 'dfdakdsbfudshfsuiofh89wefheyh9dhafecdusohcaidcehuh8cdoahcods',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));
app.use((req, res, next) => {
  if (req.cookies.token && !req.session.user) {
      res.clearCookie('token');        
  }
  next();
});
app.use('/testAPI', testAPIRouter);
require('./api/v1.0/routes')(app);

app.get('*', (req, res) => res.status(200).send({
  message: 'You have been directed to a non-existent route.',
}));

// var job = new CronJob('0 */1 * * * *', function() {
//   console.log('You will see this message every 1 minute');
//   sendMail()
// }, null, true, 'America/Los_Angeles');
// job.start();

export default app;
