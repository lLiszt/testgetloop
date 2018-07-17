// Echo reply



const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const AIMLParser = require('aimlparser')


const app = express()
const port = process.env.PORT || 4000
const aimlParser = new AIMLParser({ name:'HelloBot' })
const loadJsonFile = require('load-json-file');
 



aimlParser.load(['./test-aiml.xml'])

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/webhook', (req, res) => {

    let reply_token = req.body.events[0].replyToken
    let msg = req.body.events[0].message.text
    aimlParser.getResult(msg, (answer, wildCardArray, input) => {
        reply(reply_token, answer )
    })

    res.sendStatus(200)

})

app.listen(port)

function reply(reply_token, msg) {

    let headers = {

        'Content-Type': 'application/json',

        'Authorization': 'Bearer {ffoSQHv7DNQl8fCqtoCR7aZlf+wHzJcNd7K9crw+nIcZcTepvAZ3933vuwEwSnUxg41iHupe5eZHvPkYDGxLJEcwZUlA/+kS6bWbL0OtbsYC1b6/NfVnXX09z4uUhzHvza4UrjWsRx8nAsA1vsLHPAdB04t89/1O/w1cDnyilFU=}'

    }
   var menu = 'loadJsonFile('test.json').then(json => {console.log(json);});'

    let body = JSON.stringify({

        replyToken: reply_token,

        messages: [{

            type: 

            'text',

            text: msg

        }]
        messages: [{

            type: 

            'text',

            text: menu
    //=> {foo: true}
            

        }]

    }
    )


    request.post({

        url: 'https://api.line.me/v2/bot/message/reply',

        headers: headers,

        body: body

    }, (err, res, body) => {

        console.log('status = ' + res.statusCode);

    });

}