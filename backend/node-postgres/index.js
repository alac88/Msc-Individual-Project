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

app.get('/compareApps', (req, res) => {

  const { spawn } = require('child_process');
  const pythonAnalysis = spawn('python', ['/Users/alexandrelac/Documents/Projects/Individual/Msc-Individual-Project/backend/scripts/run_analysis.py', req.query.apps]);

  pythonAnalysis.stdout.on('data', function(data) {
      // console.log(data.toString());
      res.write(data);
      res.end();
  });
})