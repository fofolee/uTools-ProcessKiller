const os = require('os')
const iconv = require('iconv-lite')
const { spawn, exec, execFile, execSync } = require("child_process")
const path = require("path")
const fs = require('fs');
const jschardet = require('jschardet');

isDev = /unsafe-\w+\.asar/.test(__dirname) ? false : true

basename = path.basename

GetBinPath = ExeFile => {
    if (isDev) {
        return path.join(__dirname, 'bin', ExeFile)
    } else {
        return path.join(__dirname.replace(/(unsafe-\w+\.asar)/,'$1.unpacked'), 'bin', ExeFile)  
    }
}


isWin = os.platform() == 'win32' ? true : false;

totalMem = os.totalmem();

powershell = (cmd, callback) => {
    const ps = spawn('powershell', ['-NoProfile', '-Command', cmd], { encoding: 'buffer' })
    let chunks = [], err_chunks = [], size = 0, err_size = 0;
    ps.stdout.on('data', chunk => {
        chunks.push(chunk);
        size += chunk.length;
    })
    ps.stderr.on('data', err_chunk => {
        err_chunks.push(err_chunk);
        err_size += err_chunk.length;
    })
    ps.on('close', code => {
        let stdout = Buffer.concat(chunks, size);
        stdout = stdout.length ? iconv.decode(stdout, jschardet.detect(stdout).encoding) : '';
        let stderr = Buffer.concat(err_chunks, err_size);
        stderr = stderr.length ? iconv.decode(stderr, jschardet.detect(stderr).encoding) : '';
        callback(stdout, stderr)
    })
}

tasklist = () =>
    new Promise((reslove, reject) => {
        {
            var tasklist = [];
            if (isWin) {
                execFile(GetBinPath('ProcessKiller.exe'), ['getProcess'], { encoding: 'buffer' },(err, stdout, stderr) => {
                    err && reject(iconv.decode(stderr, 'gb18030'));
                    data = JSON.parse(iconv.decode(stdout, 'gb18030'));
                    data = data.sort((x,y) => {
                        return y.WorkingSet - x.WorkingSet;
                    });
                    reslove(data);
                })
                // exec('net session > NULL && echo 1 || echo 0', (err, stdout, stderr) => {
                //     let isAdmin = parseInt(stdout),
                //         IncludeUserName = isAdmin ? '-IncludeUserName' : '',
                //         UserName = isAdmin ? ',UserName' : '';
                //     powershell(`Get-Process ${IncludeUserName} | sort-object ws -descending | Select-Object ProcessName,Path,Description,WorkingSet${UserName} | ConvertTo-Json`, (stdout, stderr) => {
                //         stderr && console.log(stderr);
                //         tasklist = JSON.parse(stdout);
                //         reslove(tasklist);
                //     });
                // })
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
                            let reg = /.*?\/Applications\/.*?\.app\//.exec(dict.path)
                            dict.app = reg ? reg[0] : false;
                            tasklist.push(dict);
                        }
                    });
                    reslove(tasklist);
                });
            }
        }
    })
    

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

findThirdIndex = (str, cha) => {
    var x = str.indexOf(cha);
    var y = str.indexOf(cha, x + 1);
    var z = str.indexOf(cha, y + 1);
    if (z == -1) return x
    return z;
}

icns2Base64 = icns => {
    buffer = fs.readFileSync(icns, Buffer)
    ImgHead = Buffer.from([0x89, 0x50, 0x4E, 0x47])
    ImgTail = Buffer.from([0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82])
    var start = findThirdIndex(buffer, ImgHead);
    // var WidthPos = start + 18;
    // var ImgWidth = buffer.readInt16BE(WidthPos);
    var end = findThirdIndex(buffer, ImgTail) + 8;
    var b64 = buffer.slice(start, end).toString('base64')
    return b64
}


GetIcons = PathList =>
    new Promise((reslove, reject) => {
        if (isWin) {
            PathList = PathList.join("|").replace("\\", "/");
            execFile(GetBinPath('ProcessKiller.exe'), ["getIcons", PathList],{ encoding: 'buffer' },(error, stdout, stderr) => {
                error && reject(iconv.decode(stderr, 'gb18030'));
                data = JSON.parse(iconv.decode(stdout, 'gb18030'));
                reslove(data);
              });
        } else {
            data = []
            PathList.forEach(p => {
                var InfoFile = path.join(p, 'Contents', 'Info.plist');
                if (fs.existsSync(InfoFile)) {
                    var info = execSync(`plutil -p "${InfoFile}"`);
                    var IconFile = /"CFBundleIconFile" => "(.*?)(\.icns){0,1}"/.exec(info)[1] + '.icns';
                    IconFile = path.join(p, 'Contents', 'Resources', IconFile);
                    var b64Ico = icns2Base64(IconFile);
                    data.push({
                        path: p,
                        b64Ico: b64Ico
                    })
                }
            })
            reslove(data)
        }
    })

// var initTime = new Date().getTime();
// powershell(`Get-Process | sort-object ws -descending | Select-Object ProcessName,Path,Description,WorkingSet | ConvertTo-Json`, (stdout, stderr) => {
//     stderr && console.log(stderr);
//     tasklist = JSON.parse(stdout);
//     console.log(tasklist);
//     var EndTime = new Date().getTime();
//     console.log(EndTime - initTime);
// })

// execFile(path.join('bin', 'ProcessKiller.exe'), ['getProcess'], (err, stdout, stderr) => {
//     console.log(JSON.parse(stdout));
//     var EndTime = new Date().getTime();
//     console.log(EndTime - initTime);
// })