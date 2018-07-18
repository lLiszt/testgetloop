// Echo reply
"use strict";


const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const AIMLParser = require('aimlparser')
const path = require('path');
const cp = require('child_process');
const fs = require('fs');
const line = require('@line/bot-sdk');




const app = express()
const port = process.env.PORT || 4000
const aimlParser = new AIMLParser({ name:'HelloBot' })


 



aimlParser.load(['./test-aiml.xml'])

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/static', express.static('static'));
app.use('/downloaded', express.static('downloaded'));

app.post('/webhook', (req, res) => {

    let reply_token = req.body.events[0].replyToken
    let msg = req.body.events[0].message.text
    let ljf = req.body.events[0].message.text
    aimlParser.getResult(msg, (answer, wildCardArray, input) => {
        reply(reply_token, answer )
    })

    res.sendStatus(200)

})

app.listen(port)



  
   
   function reply(message,reply_token, msg, source) {
      let headers = {

        'Content-Type': 'application/json',

        'Authorization': 'Bearer {ffoSQHv7DNQl8fCqtoCR7aZlf+wHzJcNd7K9crw+nIcZcTepvAZ3933vuwEwSnUxg41iHupe5eZHvPkYDGxLJEcwZUlA/+kS6bWbL0OtbsYC1b6/NfVnXX09z4uUhzHvza4UrjWsRx8nAsA1vsLHPAdB04t89/1O/w1cDnyilFU=}'

    }
  

  switch (message.text) {
   
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
    case 'carousel':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Carousel alt text',
          template: {
            type: 'carousel',
            columns: [
              {
                thumbnailImageUrl: buttonsImageURL,
                title: 'hoge',
                text: 'fuga',
                actions: [
                  { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                  { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                ],
              },
              {
                thumbnailImageUrl: buttonsImageURL,
                title: 'hoge',
                text: 'fuga',
                actions: [
                  { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                  { label: 'Say message', type: 'message', text: 'Rice=米' },
                ],
              },
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

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

    request.post({

        url: 'https://api.line.me/v2/bot/message/reply',

        headers: headers,

        body: body

    }, (err, res, body) => {

        console.log('status = ' + res.statusCode);

    });

}