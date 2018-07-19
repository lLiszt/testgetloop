const crypto = require('crypto');
require('dotenv').config();

const channelSecret = process.env.CHANNEL_SECRET; // Channel secret string
const body = 'test' // Request body string
const signature = crypto
  .createHmac('SHA256', channelSecret)
  .update(body).digest('base64');

  console.log(signature)