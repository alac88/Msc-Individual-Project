const path = require('path');
const fs = require('fs');
const csv = require("csvtojson");
const VTDirectoryPath = path.join(__dirname, '../scripts/download/VT_analysis/');
const flowdroidDirectoryPath = path.join(__dirname, '../scripts/download/FlowDroid_processed/');
const scriptsPath = path.join(__dirname, '../scripts/')

const express = require('express')
const app = express()
const port = 3001

var isPolling = false;

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

const database = require('./database')

app.use(express.json())
app.use(function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/', (req, res) => {
  database.getApps(req.query.name, req.query.category, req.query.rating, req.query.Max)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/categories', (req, res) => {
  database.getCategories()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/VTanalysis', (req, res) => {
  fs.readdir(VTDirectoryPath, function (err, files) {
    listVT = [];
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
      listVT.push({ "name": file, "content": JSON.parse(fs.readFileSync(VTDirectoryPath + file).toString())});
    });
    res.send(listVT);
    res.end();
  });
})

app.get('/flowdroidAnalysis', (req, res) => {

    listFlowdroid = [];
    fs.readdir(flowdroidDirectoryPath, function (err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      } 
      files.forEach(function (file, index, array) {
        csv().fromFile(flowdroidDirectoryPath + file).then((json) => {
          if (file !== "flowdroid_global.csv"){
            listFlowdroid.push({ "name": file, "content": json});
          }
          if (index == array.length - 1){
            res.send(listFlowdroid);
            res.end();
          }
        })
      });
      
    });
    
})

app.get('/startPolling', (req, res) => {
  isPolling = true;
  res.write(isPolling.toString());
  res.end();
})

app.get('/stopPolling', (req, res) => {
  isPolling = false;
  res.write(isPolling.toString());
  res.end();
})

app.get('/compareApps', (req, res) => {
  if (isPolling && (req.query.runScript == 'true')){
    const { spawn } = require('child_process');
    const pythonAnalysis = spawn('python3', [scriptsPath + 'run_analysis.py', req.query.apps]);
  
    pythonAnalysis.stdout.on('data', function(data) {
      console.log(Buffer.from(data).toString().replace(/[\n\r]+/g, ''));
      if (Buffer.from(data).toString().replace(/[\n\r]+/g, '') === "END"){
        isPolling = false;
      }
    });
  }
  
  res.write(isPolling.toString());
  res.end();
})


app.get('/clean', (req, res) => {
  const { spawn } = require('child_process');
  const child = spawn("sudo", ["rm", "-rf", scriptsPath + "download/Features_files/", scriptsPath + "download/FlowDroid_outputs", scriptsPath + "download/FlowDroid_processed", scriptsPath + "download/VT_analysis/", scriptsPath + "download/samples/"])
  res.end();
})