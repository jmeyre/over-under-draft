const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const { apiCaller, getData } = require('./functions/api.js');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const app = express();

const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('insertDB');

// Start recurring api call
console.log('apiCaller() CALL');
apiCaller();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../build')));

// Answer API requests.
app.get('/api', async function (req, res) {
   // log user location
   const ip = req.header('x-forwarded-for');
   const collection = db.collection(`accesses-${ip}`);

   var fetch_res = await fetch(`http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`);
   var fetch_data = await fetch_res.json();
   const accessInfo = {
     timestamp: new Date().toString(),
     ipAddress: ip,
     city: fetch_data.city,
     state: fetch_data.region_name,
     country: fetch_data.country_name,
     zip: fetch_data.zip
   };
   const result = await collection.insertOne(accessInfo);
 
   console.log(`document inserted with id ${result.insertedId}`);

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
