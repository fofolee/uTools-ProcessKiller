const fs = require('fs');
const path = require("path");
const iconExtractor = require('icon-extractor');
const os = require('os')
const iconv = require('iconv-lite')
const { spawn } = require("child_process")


getico = tasks =>{
    iconExtractor.emitter.on('icon', function (data) {
        let icondir = path.join(os.tmpdir(), 'ProcessIcon')
        fs.exists(icondir, exists => {
            if (!exists) { fs.mkdirSync(icondir) }
            let iconpath = path.join(icondir, `${data.Context}.png`)
            fs.exists(iconpath, exists => {
                if (!exists) {
                    fs.writeFile(iconpath, data.Base64ImageData, "base64", err => {
                        if (err) { console.log(err); }
                    })
                }
            })
        })
    });

    for (var task of tasks) {
        iconExtractor.getIcon(task.ProcessName, task.Path);
    }
}

powershell = (cmd, callback) => {
    const ps = spawn('powershell', ['-Command', cmd], { encoding: 'buffer' })
    let chunks = [];
    let err_chunks = [];
    ps.stdout.on('data', chunk => {
        chunks.push(iconv.decode(chunk, 'cp936'))
    })
    ps.stderr.on('data', err_chunk => {
        err_chunks.push(iconv.decode(err_chunk, 'cp936'))
    })
    ps.on('close', code => {
        let stdout = chunks.join("");
        let stderr = err_chunks.join("");
        callback(stdout, stderr)
    })
}

tasklist = (callback) => {
    powershell("Get-Process | Format-List ProcessName,Path,Description", (stdout, stderr) => {
        let tasklist = [];
        let tasks = stdout.trim().split('\r\n\r\n');
        for (var task of tasks) {
            dict = {}
            let lines = task.split('\r\n')
            for (var line of lines) {
                if (line) {
                    let key = line.split(/\s+:\s*/)[0];
                    let value = line.split(/\s+:\s*/)[1];
                    dict[key] = value;
                }
            }
            var icon = path.join(os.tmpdir(), 'ProcessIcon', `${encodeURIComponent(dict.ProcessName)}.png`);
            dict.Icon = icon
            tasklist.push(dict);
        }
        tasklist.shift();
        getico(tasklist);
        callback(tasklist);
    });
}

taskkill = (taskname, taskpath, callback) => {
    let restart = taskpath == undefined ? '' : `;Start-Process -FilePath "${taskpath}"`;
    powershell(`Stop-Process -Name ${taskname}${restart}`, (stdout, stderr) => {
        callback(stderr.split('\n')[0])
    });
}