const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const { apiCaller, getData } = require('./functions/api.js');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const app = express();

// Start recurring api call
console.log('apiCaller() CALL');
apiCaller();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../build')));

// Answer API requests.
app.get('/api', async function (req, res) {
  // log user location
  const ipAddress = req.header('x-forwarded-for');
  console.log('api key: ' + process.env.IPSTACK_API_KEY);
  var fetch_res = await fetch(`http://api.ipstack.com/${ipAddress}?access_key=${process.env.IPSTACK_API_KEY}`);
  var fetch_data = await fetch_res.json();
  console.log(fetch_data);
  console.log('ip address: ' + ipAddress);
  console.log('city: ' + fetch_data.city);
  console.log('region: ' + fetch_data.region_name);
  console.log('country: ' + fetch_data.country_name);
  console.log('zip: ' + fetch_data.zip);

  // const data = {};
  const data = getData();
  res.send({ data });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.listen(PORT, function () {
  console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
});
