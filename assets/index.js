kill = (taskname, taskpath) => {
    window.taskkill(taskname, taskpath, err => {
        if (err) {
            $("#infopannel").css({ "background": "#EF5350" });
            $("#infopannel").html(err).fadeIn(300).delay(3000).fadeOut(300);
        } else {
            if(taskpath == undefined){
                $("[name='" + taskname + "']").fadeOut(300).remove()
                let tasknum = $(".taskinfo").length
                utools.setExpendHeight(tasknum > 10 ? 500 : 50 * tasknum);
                window.tasklist((task) => {
                    window.tasks = task
                });
            }else{
            $("#infopannel").css({ "background": "#83bf40" });
            $("#infopannel").html('重启进程成功！').fadeIn(300).delay(3000).fadeOut(300);
            }
        }
    });
}

show = (tasks, text) => {
    var taskinfo = '';
    for (var t of window.tasks) {
        if (t.ProcessName.toUpperCase().search(text.toUpperCase()) != -1 || t.Description.toUpperCase().search(text.toUpperCase()) != -1) {
            let title = t.Description ? t.Description : t.ProcessName;
            taskinfo += '<div class="taskinfo" name="' + t.ProcessName + '">';
            taskinfo += '<img src="file:///' + t.Icon + '">';
            taskinfo += '<div class="description">' + title + '</div><div class="path">' + t.Path + '</div></div>';
            }
        }
    $("#tasklist").html(taskinfo);
    $(".taskinfo:first").addClass("select");
    let tasknum = $(".taskinfo").length
    utools.setExpendHeight(tasknum > 10 ? 500 : 50 * tasknum);
}

utools.onPluginEnter(({ code, type, payload }) => {
    utools.setExpendHeight(0);
    window.tasklist((task) => {
        window.tasks = task
        show(window.tasks, '');
        utools.setSubInput(({ text }) => {
            show(window.tasks, text);
        }, '输入进程名，回车关闭，或点击关闭');
    });
});

$("#tasklist").on('mousedown', '.taskinfo', function (e) {
    if (1 == e.which) {
        kill($(this).attr('name'));
    } else if (3 == e.which) {
        kill($(this).attr('name'), $(this).children(".path").html().replace(/\\/g, '/'))
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
            if(pre.length != 0){
                event.preventDefault();
                if(pre.offset().top < $(window).scrollTop()){
                    $("html").animate({ scrollTop: "-=50" }, 0);
                }
                pre.addClass("select");
                $(".select:last").removeClass("select");
            }else{
                $(".select").animate({"opacity":"0.3"}).delay(500).animate({"opacity":"1"})
            }
            break;   
        case 40:
            let next = $(".select").next();
            if(next.length !=0){
                event.preventDefault();
                if(next.offset().top >= $(window).scrollTop() + 500){
                    $("html").animate({ scrollTop: "+=50" }, 0);
                }
                next.addClass("select");
                $(".select:first").removeClass("select");
            }else{
                $(".select").animate({"opacity":"0.3"}).delay(500).animate({"opacity":"1"})
            }
            break;
    }
});