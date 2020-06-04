const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config()

const APIKEY = process.env.REACT_APP_GOOGLE_API_KEY;
var myHeaders = new fetch.Headers();
myHeaders.append("Content-Type", "application/json");

function getSentiment (line) {
  var raw = JSON.stringify({
    "document":
    {
      "type": "PLAIN_TEXT",
      "language": "EN",
      "content": line
    },
    "features": {
      "extractSyntax": true,
      "extractEntities": true,
      "extractDocumentSentiment": true,
      "extractEntitySentiment": true,
      "classifyText": true
    },
    "encodingType": "UTF8"
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    compress: false,
    redirect: 'follow'
  };
  return fetch(`https://language.googleapis.com/v1/documents:annotateText?key=${ APIKEY }`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => console.log('error', error));
}

export default { getSentiment };