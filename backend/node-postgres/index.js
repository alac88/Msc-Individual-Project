const path = require('path');
const fs = require('fs');
const csv = require("csvtojson/v2");
const VTDirectoryPath = path.join(__dirname, '../scripts/download/VT_analysis/');
const flowdroidPath = path.join(__dirname, '../scripts/download/FlowDroid_processed/flowdroid_global.csv');
const runAnalysisPath = path.join(__dirname, '../scripts/run_analysis.py')

const express = require('express')
const app = express()
const port = 3001

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
  database.getApps(req.query.name, req.query.category, req.query.Max)
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
    list = []
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
      console.log('file: ', file);
      console.log('file content: ', JSON.parse(fs.readFileSync(VTDirectoryPath + file).toString()));
      list.push({ "name": file, "content": JSON.parse(fs.readFileSync(VTDirectoryPath + file).toString())});
    });
    res.send(list);
    res.end();
  });
})

app.get('/flowdroidAnalysis', (req, res) => {
  csv().fromFile(flowdroidPath).then((json) => {
    res.send(json);
    res.end();
  })
})

app.get('/compareApps', (req, res) => {
  const { spawn } = require('child_process');
  const pythonAnalysis = spawn('python3', [runAnalysisPath, req.query.apps]);

  pythonAnalysis.stdout.on('data', function(data) {
      console.log('pythonAnalysis: ', data);
      res.write(data);
      res.end();
  });
})