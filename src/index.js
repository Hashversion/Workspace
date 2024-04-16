const app = require('express')();
const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const { urlencoded } = require('express');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const Process = require('./models/process');
const path = require('path');
const PORT = 8080;
const { init, getProcessObject, getProcessesByName, executeProcessList, deleteProcessObject, updateProperty } = require('./process'); 

init().then((result) => app.listen(PORT)).catch((err) => console.log(err));
app.use(urlencoded({ extended: true }));


app.get("/", (req, res) =>{
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post("/form", (req, res) =>{
  console.log(req.body.name);
  const process = new Process({
    processData: [{
      name: req.body.name,
      category: "test",
      processList: req.body.processName,
      imagePath: "test" 
    }]
});
  process.save().then((result) => res.send(result)).catch((err) => console.log(err));
});

app.get("/processes", (req, res) =>{
  if (req.query.name == null){
    req.query.name = "testing";
  }
  else{
    console.log(req.query.name)
  }

  getProcessesByName(req.query.name).then((result) => res.send(executeProcessList(result))).catch((err) => console.log(err));
});


app.get("/test", (req, res) =>{
  res.send("<h1>Test</h1>")
})

app.get("/index.css", (req, res) =>{
  res.sendFile(path.join(__dirname, 'index.css'))
})
