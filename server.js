require('dotenv').config();
const https = require("https");
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cr = require('./api/coinremitter');

const app = express();
const PORT = process.env.PORT || 8080;

// Enhancing API security
app.use(helmet());

// Parsing JSON into JS objects
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enabling CORS for all requests
app.use(cors());

// Logging only 4xx and 5xx responses to console
app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

app.use('/public', express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/js', express.static(__dirname + '/public/js'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/test.html');
});

app.post('/invoice', (request, response) => {
  const { name, email, telegram } = request.body;
  const host = request.protocol + '://' + request.get('host');
  cr.createInvoice(name, email, telegram, host, (err, res) => {
    if (!err) {
      console.log(res.data);
      response.json(res.data.url);
    } else {
      console.error(err);
      response.json(err);
    }
  });
});

app.get('/notify_url', (req, res) => {
  res.status(200).send('Notify');
});

app.get('/success_url', (req, res) => {
  if (res.statusCode != 200) {
    return res.sendStatus(res.statusCode).send('Error');
  }
  const { flag, data } = res.data;
  if (flag == '1') {
    switch (data.status_code) {
      case '0': // Pending
        break;
      case '1': // Paid
        res.sendFile(__dirname + '/public/thank-you-page.html');
        // TODO: Send user data to Klaviyo
        break;
      case '2': // Underpaid
        break;
      case '3': // Overpaid
        break;
      case '4': // Expired
        break;
      case '5': // Cancelled
        break;
    }
  } else {
    res.status(res.statusCode).send('Error');
  }
});

app.get('/fail_url', (req, res) => {
  res.status(200).send('Fail');
});

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})

/** 
const server = https.Server({
  key: fs.readFileSync(__dirname + '/resources/certs/server-key.pem'),
  cert: fs.readFileSync(__dirname + '/resources/certs/server-cert.pem'),
  requestCert: true,
  rejectUnauthorized: true,
  maxVersion: 'TLSv1.3',
  minVersion: 'TLSv1.2'
}, app);
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
*/