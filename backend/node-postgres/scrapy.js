const spawn = require("child_process").spawn;
const pythonProcess = spawn('python',["../scrapy/main.py", arg1, arg2]);

pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString())
});