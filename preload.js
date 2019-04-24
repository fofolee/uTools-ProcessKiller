const os = require('os')
const iconv = require('iconv-lite')
const { spawn, exec } = require("child_process")
const { dialog, BrowserWindow, nativeImage } = require('electron').remote
const { shell } = require('electron');
const path = require("path")


isWin = os.platform() == 'win32' ? true : false;

getIco = isWin ? require('icon-extractor') : require('file-icon');

getLogo = () => nativeImage.createFromPath(path.join(__dirname, 'logo.png'));

messageBox = (options, callback) => {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options, index => {
        callback(index);
    })
}

open = url => {
    shell.openExternal(url);
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
    var tasklist = [];
    if (isWin) {
        powershell("Get-Process | Format-List ProcessName,Path,Description", (stdout, stderr) => {
            let tasks = stdout.trim().split('\r\n\r\n');
            for (var task of tasks) {
                dict = {}
                let lines = task.split('\r\n')
                lines.forEach(line => {
                    if (line) {
                        let key = line.split(/\s+:\s*/)[0];
                        let value = line.split(/\s+:\s*/)[1];
                        dict[key] = value;
                    }
                })
                tasklist.push(dict);
            }
            tasklist.shift();
            callback(tasklist);
        });
    } else {
        exec('ps -A -o pid -o %cpu -o %mem -o user -o comm | sed 1d | sort -rnk 3', (err, stdout, stderr) => {
            lines = stdout.split('\n');
            lines.forEach(line => {
                if (line) {
                    l = /(\d+)\s+(\d+[\.|\,]\d+)\s+(\d+[\.|\,]\d+)\s+(.*?)\s+(.*)/.exec(line);
                    dict = {
                        pid: l[1],
                        cpu: l[2],
                        mem: l[3],
                        usr: l[4],
                        path: l[5],
                        nam: l[5].split('/').pop(),
                    }
                    let ico = /\/Applications\/(.*?)\.app\//.exec(dict.path)
                    dict.ico = ico ? ico[1] : false;
                    tasklist.push(dict);
                }
            });
            callback(tasklist);
        });
    }
}

taskkill = (task, path, callback) => {
    if (isWin) {
        let restart = path == undefined ? '' : `;Start-Process -FilePath "${path}"`;
        powershell(`Stop-Process -Name ${task}${restart}`, (stdout, stderr) => {
            callback(stderr.split('\n')[0])
        });
    } else {
        let restart = path == undefined ? '' : `&& "${path}"`;
        exec(`kill -9 ${task}${restart}`, (err, stdout, stderr) => {
            callback(stderr);
        });
    }
}