const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const { exec } = require('child_process');
const Process = require('./models/process');
const path = require('path');

async function init(){
    const uri = "mongodb+srv://rc:njOhy5F4XM88LMKW@processes.sovmdyx.mongodb.net/?retryWrites=true&w=majority&appName=Processes"
    mongoose.connect(uri).then((result) => console.log(result)).catch((err) => console.log(err));
}

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

module.exports = {init, getProcessObject, getProcessesByName, executeProcessList, deleteProcessObject, updateProperty}