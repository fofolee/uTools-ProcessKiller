const fs = require('fs');
const path = require("path");
const iconExtractor = require('icon-extractor');
const os = require('os')
const PowerShell = require("powershell");


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

tasklist = (callback) => {
    let ps = new PowerShell("chcp 65001;Get-Process | Format-List ProcessName,Path,Description");
    ps.on("output", data => {
        let tasklist = [];
        let tasks = data.trim().split('\r\n\r\n');
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
    if (taskpath == undefined) {
        var ps = new PowerShell(`chcp 65001;Stop-Process -Name ${taskname}`);
    } else {
        var ps = new PowerShell(`chcp 65001;Stop-Process -Name ${taskname};Start-Process -FilePath "${taskpath}"`);
    }
    ps.on("error-output", data => {
        callback(data.split('\n')[0])
    });
}