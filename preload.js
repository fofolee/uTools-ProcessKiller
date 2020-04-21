const os = require('os')
const iconv = require('iconv-lite')
const { exec, execFile, execSync } = require("child_process")
const path = require("path")
const fs = require('fs');
const process = require('process');
const { clipboard, shell } = require('electron')
// const jschardet = require('jschardet');

isDev = /unsafe-\w+\.asar/.test(__dirname) ? false : true

basename = path.basename

copy = clipboard.writeText
open = shell.showItemInFolder

GetBinPath = ExeFile => {
    if (isDev) {
        return path.join(__dirname, 'bin', ExeFile)
    } else {
        return path.join(__dirname.replace(/(unsafe-\w+\.asar)/,'$1.unpacked'), 'bin', ExeFile)  
    }
}

isWin = os.platform() == 'win32' ? true : false;

totalMem = os.totalmem();

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
            } else {
                exec('ps -A -o pid -o %cpu -o %mem -o user -o comm | sed 1d | sort -rnk 3', (err, stdout, stderr) => {
                    lines = stdout.split('\n');
                    lines.forEach(line => {
                        if (line) {
                            l = /(\d+)\s+(\d+[\.|\,]\d+)\s+(\d+[\.|\,]\d+)\s+(.*?)\s+(.*)/.exec(line);
                            dict = { pid: l[1], cpu: l[2], mem: l[3], usr: l[4], path: l[5], nam: l[5].split('/').pop(), }
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

taskkill = (pid, restart) =>
    new Promise((reslove, reject) => {
        try {
            process.kill(pid);
        } catch (error) {
            utools.showNotification('权限不足，请以管理员权限运行uTools');
            reject(error);
        }
        if(restart){
            utools.showNotification('重启进程成功！')
            exec(`"${restart}"`);
        }
        reslove(true);
})

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