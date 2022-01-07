const path = require("path");
const express = require("express");
const { apiCaller, getData } = require( "./functions/api.js");

const PORT = process.env.PORT || 3001;

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

apiCaller();

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  const data = getData();
  res.send({ data });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
