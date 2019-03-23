const exec = require('child_process').exec;
const iconv = require('iconv-lite');

window.tasklist = (callback) => {
    // if(process.platform === 'win32'){}
    let cmd = 'tasklist /FO csv /NH /V'
    exec(cmd, function (err, stdout, stderr) {
        let tasklist = [];
        let lines = stdout.trim().split('\n');
        for (var line of lines){
           tasklist.push(line.trim().split(','));
        }
        callback(tasklist);
    })
}

window.taskkill = (taskname, callback) => {
    let cmd = 'TASKKILL /F /IM "' + taskname + '" /T'
    exec(cmd, { encoding: "buffer"}, (err, stdout, stderr) => {
        if (err) {
            callback(iconv.decode(stderr,'cp936'));
            return;
        }
        callback(iconv.decode(stdout,'cp936'));
    })
}