const app = require('express')();
const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const { urlencoded } = require('express');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const Process = require('./models/process');
const path = require('path');
const PORT = 8080;

const uri = "mongodb+srv://rc:njOhy5F4XM88LMKW@processes.sovmdyx.mongodb.net/?retryWrites=true&w=majority&appName=Processes"
mongoose.connect(uri).then((result) => app.listen(PORT)).catch((err) => console.log(err));
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

  getProcessesByName(req.query.name).then((result) => res.send(executeProcessList(result.processList[0]))).catch((err) => console.log(err));
});


app.get("/test", (req, res) =>{
  res.send("<h1>Test</h1>")
})

app.get("/index.css", (req, res) =>{
  res.sendFile(path.join(__dirname, 'index.css'))
})

async function getProcessObject(name){
  const proc = await Process.find({ 'processData': { $elemMatch: { name: name } } }); 
  return proc;
}

async function getProcessesByName(name){
  const proc = await Process.find({ 'processData': { $elemMatch: { name: name } } }).exec(); 
  return getProcessObject(name)[0].processData[0];
}

async function executeProcessList(procList){
  for (i = 0; i < procList.length; i++){
    exec(procList[i], (err, stdout, stderr) => {
      if (err) {
          console.error(err);
          return;
      }
      console.log(stdout);
  });
  }
}

async function updateProperty(property, oldName, newValue){
  const procObject = await getProcessObject(oldName)[0];
  procObject.processData[0][property] = newName;
  procObject.save();
}
