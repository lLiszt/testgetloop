// Echo reply
"use strict";

const express = require('express');
const request = require('request');
const path = require('path');
const cp = require('child_process');
const line = require('@line/bot-sdk');
const getJSON = require('get-json');
const loadJsonFile = require('load-json-file');
const asyncLoop = require('node-async-loop');

loadJsonFile('data.json').then(json => {
    console.log(json);
    //=> {foo: true}
});

require('dotenv').config();


const app = express()

const config = {
  channelAccessToken: (process.env.CHANNEL_ACCESS_TOKEN || 'ffoSQHv7DNQl8fCqtoCR7aZlf+wHzJcNd7K9crw+nIcZcTepvAZ3933vuwEwSnUxg41iHupe5eZHvPkYDGxLJEcwZUlA/+kS6bWbL0OtbsYC1b6/NfVnXX09z4uUhzHvza4UrjWsRx8nAsA1vsLHPAdB04t89/1O/w1cDnyilFU='),
  channelSecret: (process.env.CHANNEL_SECRET || 'c9865f7627be2bdc7a37a411b99e0d16'),
};

// base URL for webhook server
const baseURL = 'https://git.heroku.com/botbotbot213.git';



// create LINE SDK client
const client = new line.Client(config);

app.use('/static', express.static('static'));
app.use('/downloaded', express.static('downloaded'));

app.post('/webhook', line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  res.sendStatus(200)

  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });

});
//url
var url = require('url');
var adr = 'http://20.188.101.72:8080/api/data/po_list/2003-11-04';
//Parse the address:
var q = url.parse(adr, true);

const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

async function handleText(message, replyToken, source) {
  const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;

  let mind = 'Ub8cad621e155de8753e6ebddc9db3d68'
  let yok = 'U764500f94537bf8fea32888c9dfbc739'

  switch (message.text) { 
    case 'profile':
      let prof = await client.getProfile(source.userId);
      return replyText(replyToken, JSON.stringify(prof))
    case 'buttons':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Buttons alt text',
          template: {
            type: 'buttons',
            thumbnailImageUrl: buttonsImageURL,
            title: 'My button sample',
            text: 'Hello, my button',
            actions: [
              { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
              { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
              { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
              { label: 'Say message', type: 'message', text: 'Rice=米' },
            ],
          },
        }
      );
    case 'confirm':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Confirm alt text',
          template: {
            type: 'confirm',
            text: 'Do it?',
            actions: [
              { label: 'Yes', type: 'message', text: 'Yes!' },
              { label: 'No', type: 'message', text: 'No!' },
            ],
          },
        }
      )

    case 'A':
//get
        let geturl =  getJSON('http://20.188.101.72:8080/api/data/po_list/2003-11-04', function(error, response){              
                    error
                    response.result
                     // ["PONumber":"4500015605","CreateDate":"2003-11-04T00:00:00+07:00","Name":"MAASSBERG","Vendor":"0000001025"]
                 
                response.ok
                   
                 
                });
//loop
         let loopa = asyncLoop(geturl, function (item, next)
          {
              console.log(item);
              // Get object key with: item.key
              // Get associated value with: item.value
              next();
          }, function ()
          {
              console.log();
          });

//text
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Carousel alt text',
          template: {
            type: 'carousel',
            columns: 
            [
               "{  thumbnailImageUrl: buttonsImageURL, title: 'hoge', text: 'fuga',actions: [ { label: 'PONumber', type: 'text', data: loopa.PONumber },{ label: 'CreateDate', type: 'text', data: loopa.CreateDate },{ label: 'Name', type: 'text', data: loopa.Name },{ label: 'Vendor', type: 'text', data: loopa.Vendor }, ], }"
            ],
          },
        }
      );


    case 'image carousel':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Image carousel alt text',
          template: {
            type: 'image_carousel',
            columns: [
              {
                imageUrl: buttonsImageURL,
                action: { label: 'Go to LINE', type: 'uri', uri: 'https://line.me' },
              },
              {
                imageUrl: buttonsImageURL,
                action: { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
              },
              {
                imageUrl: buttonsImageURL,
                action: { label: 'Say message', type: 'message', text: 'Rice=米' },
              },
              {
                imageUrl: buttonsImageURL,
                action: {
                  label: 'datetime',
                  type: 'datetimepicker',
                  data: 'DATETIME',
                  mode: 'datetime',
                },
              },
            ]
          },
        }
      );
    case 'datetime':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Datetime pickers alt text',
          template: {
            type: 'buttons',
            text: 'Select date / time !',
            actions: [
              { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
              { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
              { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
            ],
          },
        }
      );
    case 'imagemap':
      return client.replyMessage(
        replyToken,
        {
          type: 'imagemap',
          baseUrl: `${baseURL}/static/rich`,
          altText: 'Imagemap alt text',
          baseSize: { width: 1040, height: 1040 },
          actions: [
            { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
            { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
            { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
            { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
          ],
        }
      );
    case 'bye':
      switch (source.type) {
        case 'user':
          return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
        case 'group':
          return replyText(replyToken, 'Leaving group')
            .then(() => client.leaveGroup(source.groupId));
        case 'room':
          return replyText(replyToken, 'Leaving room')
            .then(() => client.leaveRoom(source.roomId));
      }
    default:
      console.log(`Echo message to ${replyToken}: ${message.text}`);
      return replyText(replyToken, message.text);
  }
}


function handleImage(message, replyToken) {
  const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.jpg`);
  const previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);

  return downloadContent(message.id, downloadPath)
    .then((downloadPath) => {
      // ImageMagick is needed here to run 'convert'
      // Please consider about security and performance by yourself
      cp.execSync(`convert -resize 240x jpeg:${downloadPath} jpeg:${previewPath}`);

      return client.replyMessage(
        replyToken,
        {
          type: 'image',
          originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl: baseURL + '/downloaded/' + path.basename(previewPath),
        }
      );
    });
}

function handleVideo(message, replyToken) {
  const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.mp4`);
  const previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);

  return downloadContent(message.id, downloadPath)
    .then((downloadPath) => {
      // FFmpeg and ImageMagick is needed here to run 'convert'
      // Please consider about security and performance by yourself
      cp.execSync(`convert mp4:${downloadPath}[0] jpeg:${previewPath}`);

      return client.replyMessage(
        replyToken,
        {
          type: 'video',
          originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
          previewImageUrl: baseURL + '/downloaded/' + path.basename(previewPath),
        }
      );
    });
}

function handleAudio(message, replyToken) {
  const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.m4a`);

  return downloadContent(message.id, downloadPath)
    .then((downloadPath) => {
      var getDuration = require('get-audio-duration');
      var audioDuration;
      getDuration(downloadPath)
        .then((duration) => { audioDuration = duration; })
        .catch((error) => { audioDuration = 1; })
        .finally(() => {
          return client.replyMessage(
            replyToken,
            {
              type: 'audio',
              originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
              duration: audioDuration * 1000,
            }
          );
        });
    });
}

function downloadContent(messageId, downloadPath) {
  return client.getMessageContent(messageId)
    .then((stream) => new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(downloadPath);
      stream.pipe(writable);
      stream.on('end', () => resolve(downloadPath));
      stream.on('error', reject);
    }));
}

function handleLocation(message, replyToken) {
  return client.replyMessage(
    replyToken,
    {
      type: 'location',
      title: message.title,
      address: message.address,
      latitude: message.latitude,
      longitude: message.longitude,
    }
  );
}

function handleSticker(message, replyToken) {
  return client.replyMessage(
    replyToken,
    {
      type: 'sticker',
      packageId: message.packageId,
      stickerId: message.stickerId,
    }
  );
}



app.set('port', (process.env.PORT || 4000));
app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'));
});
