const path = require('path');
const fs = require('fs');
const csv = require("csvtojson");
const VTDirectoryPath = path.join(__dirname, '../scripts/download/VT_analysis/');
const flowdroidDirectoryPath = path.join(__dirname, '../scripts/download/FlowDroid_processed/');
const permissionsDirectoryPath = path.join(__dirname, '../scripts/download/Permissions/');
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
  database.getApps(req.query.page, req.query.name, req.query.category, req.query.rating, req.query.max)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.get('/appsCount', (req, res) => {
  database.getAppsCount()
  .then(response => {
    res.status(200).send(response[0].count);
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

function parseUsesPermission(line){
  if (line.lastIndexOf("android.permission.") > 0){
    return line.substring(line.lastIndexOf("android.permission.") + 19, line.lastIndexOf('"'));
  }
  return null;
}

function parsePermission(line){
  if (line.lastIndexOf(".permission.") > 0){
    return line.substring(line.lastIndexOf(".permission.") + 12, line.lastIndexOf("android:protectionLevel") - 2) + "/" + line.substring(line.lastIndexOf("android:protectionLevel=\"") + 25, line.lastIndexOf('"') );
  }
  return null;
}

app.get('/permissions', (req, res) => {

  
  fullPermissionsList = [];
  fs.readdir(permissionsDirectoryPath, function (err, dirs) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    } 
    
    dirs.forEach(function(dir, index, array){
      var stats = fs.statSync(permissionsDirectoryPath+dir);
      var permissionsList = []

      if (stats.isDirectory()){
        var lines = fs.readFileSync(permissionsDirectoryPath+dir+"/AndroidManifest.xml").toString().split("\n");
        for (var i = 0; i < lines.length; i++){
          var line = lines[i];
          if (line.indexOf("<uses-permission") != -1) {
            var permission = parseUsesPermission(line);
            if (permission){
              permissionsList.push(permission);
            }
          } else if (line.indexOf("<permission") != -1) {
            var permission = parsePermission(line);
            if (permission){
              permissionsList.push(permission);
            }
          }
        }

        fullPermissionsList.push({ "name": dir, "content": permissionsList});
      }
      if (index == array.length - 1){
        res.send(fullPermissionsList);
        res.end();
      }
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
    const pythonAnalysis = spawn('python3', [scriptsPath + 'run_analysis.py', req.query.apps, req.query.type]);
  
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
  const child = spawn("sudo", ["rm", "-rf", scriptsPath + "download/Features_files/", scriptsPath + "download/FlowDroid_outputs", scriptsPath + "download/FlowDroid_processed", scriptsPath + "download/VT_analysis/", scriptsPath + "download/samples/", scriptsPath + "download/Permissions/"])
  res.end();
})