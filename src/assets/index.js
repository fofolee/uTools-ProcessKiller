const DARWIN_DEFAULT_ICON = './imgs/darwin.png'
const WINDOW_DEFAULT_ICON = './imgs/window.png'

CacheIcons = async tasks => {
    var noCaches = [];
    if (window.isWin) {
        for (var t of tasks) {
            if (/^[A-z]:\\/.test(t.Path)) {
                if (localStorage[basename(t.Path, '.exe')] == undefined && !noCaches.includes(t.Path)) noCaches.push(t.Path)
            }
        }
        if (noCaches.length != 0) {
            var b64Icons = await GetIcons(noCaches);
            b64Icons.forEach(i => {
                localStorage[basename(i.path, '.exe')] = i.b64Ico;
            });
        } 
    } else {
        for (var t of tasks) {
            if (t.app) {
                if (localStorage[basename(t.app, '.app')] == undefined && !noCaches.includes(t.app)) noCaches.push(t.app)
            }
        }
        if (noCaches.length != 0) {
            var b64Icons = await GetIcons(noCaches);
            b64Icons.forEach(i => {
                localStorage[basename(i.path, '.app')] = i.b64Ico;
            });
        }
    }
}

kill = async (pid, restart) => {
    await window.taskkill(pid, restart)
    tasks = await tasklist();
    show(tasks, window.text);
}

search = (t, text) => {
    text = text.toUpperCase();
    var taskinfo = '';
    var icon;
    if (window.isWin) {
        icon = WINDOW_DEFAULT_ICON
        if (/^[A-z]:\\/.test(t.Path)) {
            var cache = localStorage[basename(t.Path, '.exe')];
            if (cache) icon = 'data:image/png;base64,' + cache
        }
        var n = t.ProcessName.toUpperCase();
        if (n.includes(text)) {
            var mem = (parseInt(t.WorkingSet) * 100 / window.totalMem).toFixed(2);
                // path = t.Path ? t.Path : '';
            taskinfo = `<div class="taskinfo" id="${t.Id}">
                  <img src="${icon}">
                  <div class="description">${t.ProcessName}</div>
                  <div class="usage">M: ${mem}%</div>
                  <div class="path">${t.Path}</div></div>`;
        }
    } else {
        if (t.app) {
            icon = 'data:image/png;base64,' + localStorage[basename(t.app, '.app')];
        } else {
            icon = DARWIN_DEFAULT_ICON
        }
        var n = t.nam.toUpperCase();
        if (n.includes(text)) {
            taskinfo = `<div class="taskinfo" id="${t.pid}">
                  <!--<div class="user">${t.usr}</div>-->
                  <img src="${icon}">
                  <div class="description">${t.nam}</div>
                  <div class="usage">C: ${t.cpu}% M: ${t.mem}%</div>
                  <div class="path">${t.path}</div></div>`;
        }
    }
    return taskinfo;
}

show = (tasks, text) => {
    var taskinfo = '';
    for (var t of tasks) {
        taskinfo += search(t, text);
    }
    $("#tasklist").html(taskinfo);
    $(".taskinfo:first").addClass("select");
    window.mouseLockTime = new Date().getTime();
    let tasknum = $(".taskinfo").length
    utools.setExpendHeight(tasknum > 11 ? 550 : 50 * tasknum);
    if(text) $(".description,.path").highlight(text, 'founds'); 
}

utools.onPluginEnter( async ({ code, type, payload }) => {
    utools.setExpendHeight(0);
    var db = utools.db.get('iconCache');
    if (db) {
        for (var key in db.data) {
            localStorage[key] = db.data[key]
        }
    }
    // var initTime = new Date().getTime();
    tasks = await tasklist();
    if (tasks) {
        window.text = '';
        // 读取进程耗时
        // var tasksLoadedTime = new Date().getTime();
        // tasksLoadedTime -= initTime;
        // console.log(tasksLoadedTime);
        await CacheIcons(tasks);
        // 缓存图标耗时
        // var iconsCachedTime = new Date().getTime();
        // iconsCachedTime -= (tasksLoadedTime + initTime);
        // console.log(iconsCachedTime);
        show(tasks, window.text);
        var sign = isWin ? 'Alt' : '⌘';
        $('.numbers').html(`
            <div>${sign}+1</div>
            <div>${sign}+2</div>
            <div>${sign}+3</div>
            <div>${sign}+4</div>
            <div>${sign}+5</div>
            <div>${sign}+6</div>
            <div>${sign}+7</div>
            <div>${sign}+8</div>
            <div>${sign}+9</div>
            <div>${sign}+0</div>
            <div>${sign}+-</div>`
        );
        utools.setSubInput(({ text }) => {
            window.text = text;
            show(tasks, text);
        }, '左/右键 -> 关闭/重启进程; ctrl + c/e/r -> 复制路径/在文件管理器中显示/重启');
        utools.onPluginOut(() => {
            var update = { _id: "iconCache", data: localStorage };
            if (db) update._rev = db._rev;
            utools.db.put(update);
            $('.numbers').html('');
        })
    } else {
        return utools.showNotification('获取进程列表失败')
    }
});


$("#tasklist").on('mousedown', '.taskinfo', function (e) {
    if (1 == e.which) {
        kill($(this).attr('id'), false);
    } else if (3 == e.which) {
        kill($(this).attr('id'), $(this).children(".path").text().replace(/\\/g, '/'))
    }
});

$("#tasklist").on('mousemove', '.taskinfo', function () {
    var mouseUnlockTime = new Date().getTime();
    if (mouseUnlockTime - window.mouseLockTime > 500) {
        $(".select").removeClass('select');
        $(this).addClass('select');
    }
});

Mousetrap.bind('ctrl+c', () => {
    var path = $(".select").children(".path").text();
    copy(path);
    utools.showNotification('已复制')
    return false
}); 

Mousetrap.bind('ctrl+e', () => {
    var path = $(".select").children(".path").text();
    open(path);
    return false
}); 

Mousetrap.bind('ctrl+r', () => {
    kill($(".select").attr('id'), $(".select").children(".path").text().replace(/\\/g, '/'))
    return false
}); 

Mousetrap.bind('enter', () => {
    kill($(".select").attr('id'), false);
    return false
});    

Mousetrap.bind('down', () => {
    let next = $(".select").next();
    if (next.length != 0) {
        event.preventDefault();
        if (next.offset().top >= $(window).scrollTop() + 550) {
            $("html").animate({ scrollTop: "+=50" }, 0);
        }
        next.addClass("select");
        $(".select:first").removeClass("select");
    } else {
        $(".select").animate({ "opacity": "0.3" })
            .animate({ "opacity": "1" })
    }
    return false
});

Mousetrap.bind('up', () => {
    let pre = $(".select").prev();
    if (pre.length != 0) {
        event.preventDefault();
        if (pre.offset().top < $(window).scrollTop()) {
            $("html").animate({ scrollTop: "-=50" }, 0);
        }
        pre.addClass("select");
        $(".select:last").removeClass("select");
    } else {
        $(".select").animate({ "opacity": "0.3" })
            .animate({ "opacity": "1" })
    }
    return false
});

key = isWin ? 'alt' : 'command'

Mousetrap.bind([`${key}+1`], function (e) {
    var index = ($(window).scrollTop()) / 50;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+2`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 1;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+3`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 2;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+4`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 3;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+5`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 4;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+6`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 5;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+7`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 6;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+8`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 7;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+9`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 8;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+0`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 9;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})

Mousetrap.bind([`${key}+-`], function (e) {
    var index = ($(window).scrollTop()) / 50 + 10;
    kill($(`.taskinfo:eq(${index})`).attr('id'), false);
    return false;
})
