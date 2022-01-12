const path = require("path");
const express = require("express");
const { apiCaller, getData } = require( "./functions/api.js");

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

apiCaller();

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  const data = getData();
  res.send({ data });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
