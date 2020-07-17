/* eslint-disable linebreak-style */
require('dotenv').config();

export const development = {
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminUserName: process.env.ADMIN_USERNAME,
  adminPassWord: process.env.ADMIN_PASSWORD,
  cloudName: process.env.cloud_name,
  apiKey: process.env.api_key,
  apiSecret: process.env.api_secret,
  cronEmail: process.env.CRON_EMAIL,
  sendGridUserName: process.env.SENDGRID_USERNAME,
  sendGridPassWord: process.env.SENDGRID_PASSWORD,
  tokenExpireTime: '6h',
  saltingRounds: 2,
};

export const production = {
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminUserName: process.env.ADMIN_USERNAME,
  adminPassWord: process.env.ADMIN_PASSWORD,
  cloudName: process.env.cloud_name,
  apiKey: process.env.api_key,
  apiSecret: process.env.api_secret,
  cronEmail: process.env.CRON_EMAIL,
  sendGridUserName: process.env.SENDGRID_USERNAME,
  sendGridPassWord: process.env.SENDGRID_PASSWORD,
  tokenExpireTime: '6h',
  saltingRounds: 2,
};
