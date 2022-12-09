const express = require('express');
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
app.get('/api', function (req, res) {
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
