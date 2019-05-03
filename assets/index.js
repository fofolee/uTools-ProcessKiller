checkUpdate = () => {
    let cv = 'v0.0.5',
        pg = 'https://yuanliao.info/d/296';
    if (!utools.db.get(cv)) {
        $.get(pg, data => {
            data = /<title>\[插件\]\[关闭进程 ProcessKiller (.*?)\](.*?) - 猿料<\/title>/.exec(data);
            let lv = data[1],
                desc = data[2];
            if (lv != cv) {
                options = {
                    type: 'info',
                    title: '插件有可用更新',
                    icon: window.getLogo(),
                    cancelId: 1,
                    message: `发现新版本 ${lv}，是否前往更新？\n更新内容：\n${desc}`,
                    buttons: ['起驾', '朕知道了', '别再烦朕']
                };
                window.messageBox(options, index => {
                    if (index == 0) {
                        window.open(pg)
                    } else if (index == 2) {
                        utools.db.put({ _id: cv, data: "pass" })
                    }
                })
            }
        })
    }
}

saveIcon = async tasks => {
    if (window.isWin) {
        window.getIco.emitter.on('icon', function (data) {
            localStorage[data.Context] = data.Base64ImageData;
        });
        for (var t of tasks) {
            if (localStorage[t.ProcessName] == undefined) window.getIco.getIcon(t.ProcessName, t.Path || '');
        }
    } else {
        for (var t of tasks) {
            if (localStorage[t.nam] == undefined) {
                if (t.ico) {
                    const buffer = await window.getIco.buffer(t.ico, {
                        size: 32
                    });
                    localStorage[t.nam] = buffer.toString('base64');
                } else {
                    localStorage[t.nam] = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAFNWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHRpZmY6T3JpZW50YXRpb249IjEiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA0LTI0VDEwOjAwOjE1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNC0yNFQxMDowMToyMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wNC0yNFQxMDowMToyMyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MGQzMmU1Yi02OWY4LTRhOWYtYWUxNS0wMWEwZWY2Mzc2YTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTBkMzJlNWItNjlmOC00YTlmLWFlMTUtMDFhMGVmNjM3NmE0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OTBkMzJlNWItNjlmOC00YTlmLWFlMTUtMDFhMGVmNjM3NmE0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTBkMzJlNWItNjlmOC00YTlmLWFlMTUtMDFhMGVmNjM3NmE0IiBzdEV2dDp3aGVuPSIyMDE5LTA0LTI0VDEwOjAxOjIzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+vwRiLQAAAuRJREFUWIXtlz1vHFUUhp9z52Mn67UTs7YcCSnio0AhFHSIgnSIIoqEokiIOgVtfkF+QmoqSxRUiI4SiShBCKVPhQSyowg7C14p9to7d+aeQ7E7s7vxWMGwa1PwSqMZzcc9z5zznntnxMw4T7lzjf5fAIirgwvtNh98dP1Dn+fZoqoiAq0sy39++PCno8PBLMCNW7e/jES+6O3uIK4pMTLe29Txy3r5WvUmAhhmRre7xo1btzeBOzMA+XD48XfffsNyZwkZPzBfADCM/YMBn372+SfVHTVAWfi91dVLb62trZNmKb43xHLFrcRQGtJymFfCfkm83iLseSR1xN0UC6+umXMO7z1R7zlF4feOAaiaYYaaUvRz0qsdktczit+HUBhhvyTKHEvvrTB40KNz8zLmlcGjP3Dt6JUAADYKgenEZTWAqWIGOgy0Lnd47c4blM9yyt0dunff5uCHHvF6imvFXHj/EsXTI/pfb+Oy0zWSmaGqk8zUGTDFzMAJlivlnzn+twGmht86RAclmivF1hGHj/dwyzHJlTZWnK5lzAybApiUIChqiiRC6Hv6m1u03ulgXund/wVJHdFyTHb1Igc/9iifDYnXUsqnR/8qA7MlUAMDt5IQ+p6DB6P6SuIQIPQL9r/fIVpNGT55AQLuYgJ/w4T1i5qiGhoyoIFqXRADySKibNZcEglRKwXALY8fPUXwyoQamjygip7BwmSmhKkMTABCGBMuFsLM0NAEoGHGnfOWiIzjWHMJQjirEtiMCWuA0UR0jgBBF++BavzmLgi6UA/UcfSELjANtQcqwyxKdtI8cFZq9MCiAaaz2rwankkG7FismcUIRqTOOVzjd+E/12g8dzKAqjqAEEK9zVMiUtfexrFmAJIk6QJsb2/PNXCT4jjuHgMoiuKra9fevTcYHMqi/OCcY6ndNu/9ZnVObKr3NzY23hSR1HQ0I8xrNqjGEucEs2Jnd/fXybfH/z+n56y/AJCowRn/6NLmAAAAAElFTkSuQmCC'
                }
            }
        }
    }
}

kill = (taskname, taskpath) => {
    window.taskkill(taskname, taskpath, err => {
        if (err) {
            $("#infopannel").css({
                "background": "#EF5350"
            });
            $("#infopannel").html(err).fadeIn(300).delay(3000).fadeOut(300);
        } else {
            if (taskpath == undefined) {
                let tasknum = $(".taskinfo").length
                utools.setExpendHeight(tasknum > 11 ? 550 : 50 * tasknum);
            } else {
                $("#infopannel").css({
                    "background": "#83bf40"
                });
                $("#infopannel").html('重启进程成功！').fadeIn(300).delay(3000).fadeOut(300);
            }
            window.tasklist((task) => {
                window.tasks = task
                show(window.text);
            });
        }
    });
}

search = (t, text) => {
    text = text.toUpperCase();
    var taskinfo = '';
    if (window.isWin) {
        var icon = localStorage[t.ProcessName],
            n = (t.ProcessName + t.Description).toUpperCase();
        if (icon == undefined) icon = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEUSURBVFhHYxgFgw2w+vv7C9ASA+1ggViFBiIiImISEhLuREVFfaAljo+PPxsZGWkJtRYBgoICzgUHBvzz9/X97+9HIww0O9Df/09QUFAr1FoEcJ9/9ILXotP/PBec+E9TvPDUH/f5Rzqg1iKA+6an5712vvnnse3Ff5rina//uG980g61FgHcNz4877XtxT+PzU/+0xRvf/7Hff2jUQeMOmDUAaMOGHXAqANGHTDqgEHoALf190/57fvyz2v7i/9e21/SBgObZD57Pv52XX23EWotAhh1rUpw3/DwofuGB5/dNtyjCQaaD6TvXjLuWGUDtRYFsDCwsWnwGdqbcOpY0QTzGVqZAO1RAWJmsI2jYOABAwMAOrpjfXCfUOgAAAAASUVORK5CYII=";
        if (n.includes(text)) {
            var usr = t.UserName ? t.UserName.split('\\').pop() : '',
                title = t.Description ? t.Description : t.ProcessName,
                mem = (parseInt(t.WorkingSet) * 100 / window.totalMem).toFixed(2),
                path = t.Path ? t.Path : '';
            taskinfo = `<div class="taskinfo" name="${t.ProcessName}">
                  <div class="user">${usr}</div>
                  <img src="data:image/png;base64,${icon}">
                  <div class="description">${title}</div>
                  <div class="usage">M: ${mem}%</div>
                  <div class="path">${path}</div></div>`;
        }
    } else {
        var icon = localStorage[t.nam],
            n = t.nam.toUpperCase();
        if (icon == undefined) icon = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAFNWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHRpZmY6T3JpZW50YXRpb249IjEiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA0LTI0VDEwOjAwOjE1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNC0yNFQxMDowMToyMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wNC0yNFQxMDowMToyMyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MGQzMmU1Yi02OWY4LTRhOWYtYWUxNS0wMWEwZWY2Mzc2YTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTBkMzJlNWItNjlmOC00YTlmLWFlMTUtMDFhMGVmNjM3NmE0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OTBkMzJlNWItNjlmOC00YTlmLWFlMTUtMDFhMGVmNjM3NmE0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTBkMzJlNWItNjlmOC00YTlmLWFlMTUtMDFhMGVmNjM3NmE0IiBzdEV2dDp3aGVuPSIyMDE5LTA0LTI0VDEwOjAxOjIzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+vwRiLQAAAuRJREFUWIXtlz1vHFUUhp9z52Mn67UTs7YcCSnio0AhFHSIgnSIIoqEokiIOgVtfkF+QmoqSxRUiI4SiShBCKVPhQSyowg7C14p9to7d+aeQ7E7s7vxWMGwa1PwSqMZzcc9z5zznntnxMw4T7lzjf5fAIirgwvtNh98dP1Dn+fZoqoiAq0sy39++PCno8PBLMCNW7e/jES+6O3uIK4pMTLe29Txy3r5WvUmAhhmRre7xo1btzeBOzMA+XD48XfffsNyZwkZPzBfADCM/YMBn372+SfVHTVAWfi91dVLb62trZNmKb43xHLFrcRQGtJymFfCfkm83iLseSR1xN0UC6+umXMO7z1R7zlF4feOAaiaYYaaUvRz0qsdktczit+HUBhhvyTKHEvvrTB40KNz8zLmlcGjP3Dt6JUAADYKgenEZTWAqWIGOgy0Lnd47c4blM9yyt0dunff5uCHHvF6imvFXHj/EsXTI/pfb+Oy0zWSmaGqk8zUGTDFzMAJlivlnzn+twGmht86RAclmivF1hGHj/dwyzHJlTZWnK5lzAybApiUIChqiiRC6Hv6m1u03ulgXund/wVJHdFyTHb1Igc/9iifDYnXUsqnR/8qA7MlUAMDt5IQ+p6DB6P6SuIQIPQL9r/fIVpNGT55AQLuYgJ/w4T1i5qiGhoyoIFqXRADySKibNZcEglRKwXALY8fPUXwyoQamjygip7BwmSmhKkMTABCGBMuFsLM0NAEoGHGnfOWiIzjWHMJQjirEtiMCWuA0UR0jgBBF++BavzmLgi6UA/UcfSELjANtQcqwyxKdtI8cFZq9MCiAaaz2rwankkG7FismcUIRqTOOVzjd+E/12g8dzKAqjqAEEK9zVMiUtfexrFmAJIk6QJsb2/PNXCT4jjuHgMoiuKra9fevTcYHMqi/OCcY6ndNu/9ZnVObKr3NzY23hSR1HQ0I8xrNqjGEucEs2Jnd/fXybfH/z+n56y/AJCowRn/6NLmAAAAAElFTkSuQmCC";
        if (n.includes(text)) {
            taskinfo = `<div class="taskinfo" name="${t.pid}">
                  <div class="user">${t.usr}</div>
                  <img src="data:image/png;base64,${icon}">
                  <div class="description">${t.nam}</div>
                  <div class="usage">C: ${t.cpu}% M: ${t.mem}%</div>
                  <div class="path">${t.path}</div></div>`;
        }
    }
    return taskinfo;
}

show = text => {
    var taskinfo = '';
    for (var t of window.tasks) {
        taskinfo += search(t, text);
    }
    $("#tasklist").html(taskinfo);
    $(".taskinfo:first").addClass("select");
    window.mouseLockTime = new Date().getTime();
    let tasknum = $(".taskinfo").length
    utools.setExpendHeight(tasknum > 11 ? 550 : 50 * tasknum);
}

utools.onPluginEnter(({ code, type, payload }) => {
    utools.setExpendHeight(0);
    checkUpdate();
    if (window.isWin) {
        utools.setExpendHeight(50);
        $("#tasklist").html(`<div class="load">Loading...</div>`);
        $(".load").animate({ "opacity": "0.3" }, 500)
            .animate({ "opacity": "1" }, 500);
    }
    var db = utools.db.get('iconCache');
    if (db) {
        for (var key in db.data) {
            localStorage[key] = db.data[key]
        }
    }
    window.tasklist((task) => {
        window.tasks = task
        saveIcon(task);
        show('');
        utools.setSubInput(({ text }) => {
            window.text = text;
            show(text);
        }, '输入进程名进行搜索');
        utools.onPluginOut(() => {
            var update = {
                _id: "iconCache",
                data: localStorage
            };
            if (db) update._rev = db._rev;
            utools.db.put(update);
        })
    });
});

$("#tasklist").on('mousedown', '.taskinfo', function (e) {
    if (1 == e.which) {
        kill($(this).attr('name'));
    } else if (3 == e.which) {
        kill($(this).attr('name'), $(this).children(".path").html().replace(/\\/g, '/'))
    }
});

$("#tasklist").on('mousemove', '.taskinfo', function () {
    var mouseUnlockTime = new Date().getTime();
    if (mouseUnlockTime - window.mouseLockTime > 500) {
        $(".select").removeClass('select');
        $(this).addClass('select');
    }
});

$(document).keydown(e => {
    switch (e.keyCode) {
        case 13:
            if (event.shiftKey) {
                kill($(".select").attr('name'), $(".select").children(".path").html().replace(/\\/g, '/'))
            } else {
                kill($(".select").attr('name'));
            }
            break;
        case 38:
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
            break;
        case 40:
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
            break;
    }
});