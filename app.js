//Declaring modules and app variables
require("dotenv").config();
const dotenv=require('dotenv');
const express = require('express')
const ejs = require('ejs')
const https = require('https')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000;
const path = require('path')
const fs = require("fs");
app.use(express.static(path.join(__dirname, 'public')))
//sets the folder for HTML, Images, or any Media on the site to Public

//Sets view-engine to ejs, joins the path
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))



//Gets 'home' view, at root's "/"
app.get('/', function(req,res){
  res.render("home")
})
app.get('/video', function(req,res){
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  // get video stats (about 61MB)
  const videoPath = __dirname + "/public/video/banner.mp4";
  const videoSize = fs.statSync(__dirname + "/public/video/banner.mp4").size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});


app.listen(port, function(){
  console.log("Server started on port : " + port)
})
