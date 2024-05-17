const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Function to get formatted date and time
function getFormattedDateTime() {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  return `Date: ${formattedDate}, Time: ${formattedTime}`;
}

// Middleware to log request details and the time taken to process the request
function logRequests(req, res, next) {
  const start = Date.now();
  const { method, url } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `${getFormattedDateTime()} - Method: ${method}, URL: ${url}, Duration: ${duration} ms\n`;
    const logFilePath = path.join(__dirname, "request_logs.txt");
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) console.error("Failed to write to log file:", err);
    });
  });

  next();
}

// Apply the middleware
app.use(logRequests);

app.get("/logging-app", (req, res) => {
  res.send({
    success: true,
    mesg: "Hello, Request was successful",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
