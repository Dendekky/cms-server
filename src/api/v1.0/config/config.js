/* eslint-disable linebreak-style */
require('dotenv').config();

export const development = {
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpireTime: '6h',
  saltingRounds: 2,
};
export const production = {
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpireTime: '6h',
  saltingRounds: 2,
};
