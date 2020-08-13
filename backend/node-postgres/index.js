const path = require('path');
const fs = require('fs');
const csv = require("csvtojson/v2");
const VTDirectoryPath = path.join(__dirname, '/home/al3919/Projects/Msc-Individual-Project/backend/scripts/download/VT_analysis');
const flowdroidDirectoryPath = path.join(__dirname, '/home/al3919/Projects/Msc-Individual-Project/backend/scripts/download/FlowDroid_processed');
// const VTDirectoryPath = path.join(__dirname, '../scripts/download/VT_analysis/');
// const flowdroidPath = path.join(__dirname, '../scripts/download/FlowDroid_processed/flowdroid_global.csv');

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

// app.get('/app', (req, res) => {
//   database.getAppByPackageName(req.query.packageName)
//   .then(response => {
//     res.status(200).send(response);
//   })
//   .catch(error => {
//     res.status(500).send(error);
//   })
// })

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
  // const pythonAnalysis = spawn('python3', ['/Users/alexandrelac/Documents/Projects/Individual/Msc-Individual-Project/backend/scripts/run_analysis.py', req.query.apps]);
  const pythonAnalysis = spawn('python3', ['/home/al3919/Projects/Msc-Individual-Project/backend/scripts/run_analysis.py', req.query.apps]);

  pythonAnalysis.stdout.on('data', function(data) {
      res.write(data);
      res.end();
  });
})