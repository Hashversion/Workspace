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

  getProcessesByName(req.query.name).then((result) => res.send(executeProcessList(result))).catch((err) => console.log(err));
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

async function deleteProcessObject(name){
  await Process.deleteOne({'processData': {$elemMatch: {"name": name}}}).then((result) => 
  console.log(result)).catch((err) => console.log(err));
}

async function getProcessesByName(name){
  const proc = await getProcessObject(name); 
  return proc[0].processData[0].processList[0];
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

async function updateProperty(name, property, newValue){
  const procObject = await getProcessObject(name);
  procObject[0].processData[0][property] = newValue;
  procObject[0].save();
}