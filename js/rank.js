var rank_timer = setInterval(function () {
    if ($('tr .center').length > 0) {
        //renderRank();
        getCheckInStatus();
        $('a[href="#/statistic"]').after('<button title="升级日历" id="calendar_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">today</i></div></button>')
        $('#calendar_button').on('click', function () {
            calendar.render();
            setTimeout(function () {
                $('.fc-toolbar-title').after('<button id="calendar_close" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">cancel</i></div></button>');
                $('#calendar_close').on('click', function () {
                    location.reload();
                });
            }, 500);
        });

        $('#calendar_button').after('<button title="延长cookie过期时间" id="extend_cookie_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">stars</i></div></button>')
        $('#extend_cookie_button').on('click', function () {
            extendCookie();
        });

        $('#extend_cookie_button').after('<button title="一键签到" id="check_in_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">book</i></div></button>')
        $('#check_in_button').on('click', function () {
            checkIn();
        });

        $('#check_in_button').after('<button title="流量条" id="mybar_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">dehaze</i></div></button>')
        $('#mybar_button').on('click', function () {
            showMybar();
        });

        window.clearInterval(rank_timer);
    }
}, 100);

var check_in_list = [];
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
var check_in_status = false;
var check_in_timeout_count = 0;
var check_in_timer = setInterval(function () {
    if (check_in_timeout_count > 20) {
        alert(check_in_list.join(',') + '请求超时，请手动检查');
        check_in_status = false;
        check_in_timeout_count = 0;
        check_in_list = [];
        return;
    }
    if (check_in_list.length > 0) {
        check_in_timeout_count++;
        check_in_status = true;
    } else if (check_in_status) {
        check_in_timeout_count = 0;
        check_in_status = false;
        alert('签到完成');
    }
}, 1000);

setInterval(function () {
    if (window.location.hash !== '#/home' && window.location.hash !== '#/' && $('.fc-button-group').length > 0) {
        location.reload();
    }
    //检查是否有未登录
    $('a:contains("未登录")').each(function () {
        if ($(this).next().length > 0) {
            return;
        }
        $(this).after('<br><a>导入过期cookie</a>');
        $(this).next().next().on('click', function () {
            importExpiredCookie($(this).parents('tr').children().find('a').eq(0).attr('href'));
        })
    })
}, 1000);

function genMybarPic() {
    loadJS('/js/html2canvas.js', function () {
        $('#mybar_bbcode').hide();
        $('#mybar_pic').hide();
        $('#mybar_loading').show();
        html2canvas($('.v-content__wrap')[0], {
            useCORS: true,
            width: 444,
            background: "#fff",
        }).then(function (canvas) {
            $($('.v-content__wrap')[0]).find('img').remove();
            $($('.v-content__wrap')[0]).find('br').remove();
            $($('.v-content__wrap')[0]).append(canvas);
            $('#mybar_loading').hide();
            alert('生成成功, 右键复制图片或者下载图片')
        })
    })
}

var ptpp_user_data = '';

function showMybar() {
    var list = $('tbody').children();
    chrome.storage.local.get('PT-Plugin-Plus-Config', function (res) {
        if (typeof res['PT-Plugin-Plus-Config']['sites'] !== 'undefined') {
            ptpp_user_data = res['PT-Plugin-Plus-Config']['sites'];
        }
    });
    var mybar_bbcode = '';
    var get_user_data_timer = setInterval(function () {
        if (ptpp_user_data !== '') {
            $($('.v-content__wrap')[0]).html('<button style="margin-left: 572px;position: absolute;" id="mybar_close" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">关闭&nbsp;<i aria-hidden="true" class="v-icon material-icons theme--light">cancel</i></div></button>');
            $($('.v-content__wrap')[0]).append('<button style="display:none;margin-left: 572px;margin-top:50px;position: absolute;" id="mybar_bbcode" title="用于论坛等" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">生成BBCode代码&nbsp;<i aria-hidden="true" class="v-icon material-icons theme--light">code</i></div></button>');
            $($('.v-content__wrap')[0]).append('<button style="display:none;margin-left: 572px;margin-top:100px;position: absolute;" id="mybar_pic" title="生成图片" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">生成图片&nbsp;<i aria-hidden="true" class="v-icon material-icons theme--light">panorama</i></div></button>');
            $($('.v-content__wrap')[0]).append('<button style="margin-left: 672px;position: absolute;" id="mybar_loading" title="正在生成" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">正在生成<i aria-hidden="true" class="v-icon material-icons theme--light">autorenew</i></div></button>');
            var mybar_loading_timer = setInterval(function () {
                if ($('#mybar_loading').length === 0) {
                    window.clearInterval(mybar_loading_timer);
                    return;
                }
                if ($('#mybar_loading').html().length % 2 === 1) {
                    $('#mybar_loading').html('<div class="v-btn__content">正在加载。。<i aria-hidden="true" class="v-icon material-icons theme--light">autorenew</i></div>');
                } else {
                    $('#mybar_loading').html('<div class="v-btn__content">正在加载。<i aria-hidden="true" class="v-icon material-icons theme--light">autorenew</i></div>');
                }
            }, 300)
            $('#mybar_close').on('click', function () {
                location.reload();
            });
            $('#mybar_bbcode').on('click', function () {
                $('#mybar_bbcode').remove();
                $($('.v-content__wrap')[0]).find('img').remove()
                $($('.v-content__wrap')[0]).find('br').remove()
                $('#mybar_pic').remove();
                $($('.v-content__wrap')[0]).append('<textarea style="width: 500px;height: 100%;">' + mybar_bbcode + '</textarea>');
            });
            $('#mybar_pic').on('click', function () {
                genMybarPic();
            });
            window.clearInterval(get_user_data_timer);
            for (var i = 0; i < list.length; i++) {
                let item = $(list[i]);
                if (!item.children().eq(1).text()) {
                    continue;
                }
                let site_url = item.find('.caption').parent();
                if (!site_url) {
                    continue;
                }
                let site_url_href = site_url.attr('href');
                if (!site_url_href) {
                    continue;
                }
                let site_user_data = '';
                let site_schema = '';

                site_url = parseUrl(site_url_href);
                if (typeof site_url.host === 'undefined') {
                    continue;
                }
                site_url = site_url.host;

                for (var j = 0; j < ptpp_user_data.length; j++) {
                    if (ptpp_user_data[j]['host'] === 'www.nicept.net') {
                        ptpp_user_data[j]['host'] = 'nicept.net';
                    }
                    if (site_url === ptpp_user_data[j]['host'] || site_url.replace(/www./, '') === ptpp_user_data[j]['host']) {
                        if (typeof ptpp_user_data[j]['schema'] !== 'undefined') {
                            site_schema = ptpp_user_data[j]['schema'];
                        } else {
                            $.ajax({
                                url: '/resource/sites/' + ((site_url === ptpp_user_data[j]['host']) ? site_url : site_url.replace(/www./, '')) + '/config.json',
                                async: false,
                                type: 'GET',
                                dataType: 'JSON',
                                success: function (res) {
                                    site_schema = res.schema;
                                },
                            })
                        }
                        //ccfbits config.json里没写schema
                        if (site_schema === 'NexusPHP' || site_schema === 'TTG' || site_url === 'ccfbits.org') {
                            site_user_data = ptpp_user_data[j]['user'];
                        }
                        break;
                    }
                }
                if (site_user_data === '') {
                    continue;
                }
                if (site_url_href.substr(site_url_href.length - 1, 1) !== '/') {
                    site_url_href += '/';
                }

                if (site_url === 'hdcity.city') {
                    site_user_data.id = site_user_data.id[0];
                }
                if (typeof site_user_data.id === 'undefined' || isNaN(site_user_data.id) || !site_user_data.id) {
                    continue;
                }
                $.ajax({
                    url: site_url_href + 'mybar.php?userid=' + site_user_data.id + '.png',
                    type: 'GET',
                    complete: function (xhr, status) {
                        if (status === 'success') {
                            if (xhr.responseText.length < 800) {
                                return;
                            }
                            mybar_bbcode += '[img]' + site_url_href + 'mybar.php?userid=' + site_user_data.id + '.png' + '[/img]' + "\r\n";
                            $($('.v-content__wrap')[0]).append('<img style="margin-top:5px;width:444px;" src="' + site_url_href + 'mybar.php?userid=' + site_user_data.id + '.png' + '"><br>');
                        }
                    },
                    // async: false,
                    timeout: 10000
                })
            }
            $(document).ajaxStop(function () {
                $('#mybar_loading').hide()
                $("#mybar_bbcode").show();
                $("#mybar_pic").show();
            });
        }
    }, 100);
}

function importExpiredCookie(site_url) {
    try {
        chrome.cookies.getAllCookieStores(function () {
        });
    } catch (e) {
        alert('请前往权限设置，打开cookie操作权限');
        return;
    }
    var cookies = prompt("导入cookie", "请复制ptpp备份文件中的cookies.json，内容全部粘贴到这里");
    try {
        cookies = JSON.parse(cookies);
        if (cookies.length > 0) {
            let import_cookies_flag = false;
            for (var i = 0; i < cookies.length; i++) {
                if (site_url === cookies[i].url) {
                    for (var j = 0; j < cookies[i].cookies.length; j++) {
                        var param = {
                            url: site_url,
                            name: cookies[i].cookies[j].name,
                            value: cookies[i].cookies[j].value,
                            domain: cookies[i].cookies[j].domain,
                            path: cookies[i].cookies[j].path,
                            secure: cookies[i].cookies[j].secure,
                            httpOnly: cookies[i].cookies[j].httpOnly,
                            sameSite: cookies[i].cookies[j].sameSite,
                            storeId: cookies[i].cookies[j].storeId,
                            expirationDate: 2147483647,
                        };
                        chrome.cookies.set(param, function (cookie) {
                        });
                        import_cookies_flag = true;
                    }
                    break;
                }
            }
            if (import_cookies_flag === false) {
                alert('恢复失败');
            } else  {
                alert('恢复成功,请尝试重新刷新站点');
            }
        } else {
            alert('格式不正确，请复制ptpp备份文件中的cookies.json，内容全部复制到这里');
        }
    } catch (e) {
        alert('格式不正确，请复制ptpp备份文件中的cookies.json，内容全部粘贴到这里');
    }

}

function getCheckInStatus() {
    var list = $('tbody').children();
    for (var i = 0; i < list.length; i++) {
        var item = $(list[i]);
        if (!item.children().eq(1).text()) {
            continue;
        }
        let site_url = item.find('.caption').parent();
        if (!site_url) {
            continue;
        }
        site_url = site_url.attr('href');
        if (!site_url) {
            continue;
        }
        site_url = parseUrl(site_url).host.replace(/www\./, '').replace(/\./g, '_');
        if (!isNaN(site_url.substr(0, 1))) {
            site_url = 'i' + site_url;
        }
        var check_in = localStorage.getItem('check_in');
        if (check_in === null) {
            return;
        }
        check_in = JSON.parse(check_in);
        var check_in_date = '';

        eval('try{check_in_date = check_in.' + site_url + ';}catch(e){}');
        if (check_in_date && check_in_date === ((new Date().getMonth() + 1) + '' + new Date().getDate())) {
            item.find('.caption').after('<span style="color:green;">✔</span>');
        }
    }
}

function checkIn() {
    // $.ajaxSettings.async = false;
    // $.ajaxSettings.timeout = 10;
    alert('正在一键签到');
    var list = $('tbody').children();
    for (var i = 0; i < list.length; i++) {
        var item = $(list[i]);
        let item2 = $(list[i]);
        if (!item.children().eq(1).text()) {
            continue;
        }
        let site_url = item.find('.caption').parent();
        if (!site_url) {
            continue;
        }
        site_url = site_url.attr('href');
        if (!site_url) {
            continue;
        }
        var caption_parent_find_span = item.find('.caption').parent().find('span');
        for (var j = 0; j < caption_parent_find_span.length; j++) {
            if ($(caption_parent_find_span[j]).attr('style') === 'color:green;') {
                $(caption_parent_find_span[j]).remove();
            }
        }
        var check_in_config = getCheckInConfig(site_url);
        if (check_in_config.url !== "" || check_in_config.callback !== "") {
            if (check_in_config.callback) {
                check_in_config.callback(item2);
            } else {
                var check_in_site_url = parseUrl(site_url).host.replace(/www\./, '').replace(/\./g, '_');
                if (!isNaN(check_in_site_url.substr(0, 1))) {
                    check_in_site_url = 'i' + check_in_site_url;
                }
                check_in_list.push(check_in_site_url);
                $.get(check_in_config.url, function () {
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    var check_in_site_url = parseUrl(site_url).host.replace(/www\./, '').replace(/\./g, '_');
                    if (!isNaN(check_in_site_url.substr(0, 1))) {
                        check_in_site_url = 'i' + check_in_site_url;
                    }
                    eval('check_in.' + check_in_site_url + ' = (new Date().getMonth() + 1) + \'\' + new Date().getDate();')
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove(check_in_site_url);
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                });
            }
        }
    }
}

function downloadFile(content, fileName) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    element.click();
}

function extendCookie() {
    if (localStorage.getItem('cookie_backup') !== null) {
        if (confirm('您已使用过此功能')) {
            if (!confirm('确定再次更新cookie过期时间吗')) {
                return;
            }
        } else {
            return;
        }
    } else {
        if (!confirm('确定延长全站cookie过期时间吗')) {
            return;
        }
    }

    try {
        chrome.cookies.getAllCookieStores(function () {
        });
    } catch (e) {
        alert('请前往权限设置，打开cookie操作权限');
        return;
    }
    var list = $('tbody').children();
    var cookie_backup = [];
    for (var i = 0; i < list.length; i++) {
        var item = $(list[i]);
        if (!item.children().eq(1).text()) {
            continue;
        }
        let site_url = item.find('.caption').parent();
        if (!site_url) {
            continue;
        }
        site_url = site_url.attr('href');
        if (!site_url) {
            continue;
        }
        chrome.cookies.getAll({"url": site_url}, function (cookie) {
            let update_cookie_count = 0;
            for (var j = 0; j < cookie.length; j++) {
                cookie_backup.push(cookie[j]);
                if (typeof cookie[j].expirationDate === 'undefined') {
                    continue;
                }
                if (typeof cookie[j].name === 'undefined') {
                    continue;
                }
                //chrome.cookies.remove({url: site_url, name: cookie[j].name}, function() {});continue;
                var param = {
                    url: site_url,
                    name: cookie[j].name,
                    value: cookie[j].value,
                    domain: cookie[j].domain,
                    path: cookie[j].path,
                    secure: cookie[j].secure,
                    httpOnly: cookie[j].httpOnly,
                    expirationDate: 2147483647,
                };
                chrome.cookies.set(param, function (cookie) {
                });
                update_cookie_count++;
            }
        });
    }
    setTimeout(function () {
        downloadFile(JSON.stringify(cookie_backup), 'PT-Plugin-Plus-Cookie-Backup-' + getDate + '.json')
        if (localStorage.getItem('cookie_backup') === null) {
            localStorage.setItem('cookie_backup', JSON.stringify(cookie_backup));
        }
        alert('更新成功');
    }, 2000);
}

var rank_flag = false;

function renderRank() {
    var list = $('tbody').children();
    let count = 0;
    let calendar_event = [];
    for (i = 0; i < list.length; i++) {
        var item = $(list[i]);
        if (!item.children().eq(1).text()) {
            continue;
        }
        var site_name = item.find('.caption').text();
        if (!site_name) {
            continue;
        }
        var site_url = item.find('.caption').parent();
        if (!site_url) {
            continue;
        }
        site_url = site_url.attr('href');

        var site_avatar_div = item.find('.v-avatar');
        var site_avatar_img = '';
        if (site_avatar_div.length > 0) {
            site_avatar_img = site_avatar_div.find('img');
            if (site_avatar_img.length > 0) {
                site_avatar_img = site_avatar_img.attr('src');
            }
        }

        var register_date = item.children().filter(function () {
            return $(this).attr('title');
        });
        if (!register_date.length) {
            continue;
        }
        register_date = register_date.attr('title');
        if (!register_date) {
            continue;
        }
        var register_time = new Date(register_date).getTime() / 1000;

        var download_upload = item.children('.number').eq(0);
        if (!download_upload.length) {
            continue;
        }

        var download_item = $(download_upload).children().eq(1);
        var upload_item = $(download_upload).children().eq(0);

        if (!download_item.length || !upload_item.length) {
            continue;
        }

        var download = download_item.text().replace(/expand_less/, '').replace(/expand_more/, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
        var upload = upload_item.text().replace(/expand_less/, '').replace(/expand_more/, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");

        download = size2Bytes(download);
        upload = size2Bytes(upload);

        var ratio = item.children().eq(4);
        if (!ratio.length) {
            continue;
        }
        ratio = ratio.text();

        var bonus_item = item.children().eq(7);
        if (!bonus_item.length) {
            continue;
        }
        var bonus = parseInt(bonus_item.text().replace(/,/g, ''));

        var site_rank_config = getSiteRank(site_url);
        if (site_rank_config === undefined || site_rank_config === {}) {
            continue;
        }
        var site_name = site_rank_config.name;
        var site_rank = site_rank_config.ranks;
        if (site_rank === []) {
            continue;
        }

        // bonus2:做种积分 bonus3:成就积分 bonus4:等级积分

        if (parseUrl(site_url).host.replace(/www\./, '') === 'springsunday.net') {
            //处理春天的做种积分  ssd_bonus1 是魔力值  ssd_bonus2 是做种积分
            if (localStorage.getItem('ssd_bonus1') === null || localStorage.getItem('ssd_bonus2') === null || (localStorage.getItem('ssd_bonus1') != bonus)) {
                localStorage.setItem('ssd_bonus1', bonus);
                $.ajax({
                    url: 'https://springsunday.net/index.php',
                    async: false,
                    success: function (res) {
                        if (res.indexOf('userdetails.php?id=') !== -1) {
                            var ssd_user_id = res.split('userdetails.php?id=');
                            if (typeof ssd_user_id[1] !== 'undefined') {
                                ssd_user_id = ssd_user_id[1].split('"')[0];
                                if (!isNaN(ssd_user_id)) {
                                    $.ajax({
                                        url: 'https://springsunday.net/userdetails.php?id=' + ssd_user_id,
                                        async: false,
                                        success: function (res) {
                                            if (res.indexOf('<b>做种积分:</b>') !== -1) {
                                                var ssd_bonus2 = res.split('<b>做种积分:</b>');
                                                if (typeof ssd_bonus2[1] !== 'undefined') {
                                                    ssd_bonus2 = ssd_bonus2[1].split('(')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                                    if (!isNaN(ssd_bonus2)) {
                                                        localStorage.setItem('ssd_bonus2', ssd_bonus2);
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    }
                });
            }

            var ssd_bonus2 = parseInt(localStorage.getItem('ssd_bonus2'));

            if (ssd_bonus2 > 0) {
                item.children().eq(7).append('<br><span>' + number_format(ssd_bonus2) + '</span>');
            }
        }

        if (parseUrl(site_url).host.replace(/www\./, '') === 'gazellegames.net') {
            //处理ggn的成就积分  ggn_bonus1 是魔力值  ggn_total_points 是成就积分(合计)
            if (localStorage.getItem('ggn_bonus1') === null || localStorage.getItem('ggn_total_points') === null || (localStorage.getItem('ggn_bonus1') != bonus)) {
                localStorage.setItem('ggn_bonus1', bonus);
                $.ajax({
                    url: 'https://gazellegames.net/user.php?action=achievements',
                    async: false,
                    success: function (res) {
                        if (res.indexOf('Upload GB') !== -1) {
                            res = res.replace(/[\r\n]/g, "").replace(/\ +/g, "").replace(/	/g, "");
                            var ggn_total_points = '';
                            if (typeof res.split('TotalPoints:')[1] !== 'undefined') {
                                ggn_total_points = res.split('TotalPoints:')[1].split('<')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                if (ggn_total_points.length > 0 && ggn_total_points.length < 20) {
                                    console.log(ggn_total_points);
                                    localStorage.setItem('ggn_total_points', ggn_total_points);
                                }
                            }
                            var ggn_upload = '';
                            if (typeof res.split('UploadGB</span><br/><spanclass="italic">')[1] !== 'undefined') {
                                ggn_upload = res.split('UploadGB</span><br/><spanclass="italic">')[1].split('<')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                if (ggn_upload.length > 0 && ggn_upload.length < 20) {
                                    console.log(ggn_upload);
                                    localStorage.setItem('ggn_upload', ggn_upload);
                                }
                            }
                            var ggn_download = '';
                            if (typeof res.split('DownloadGB</span><br/><spanclass="italic">')[1] !== 'undefined') {
                                ggn_download = res.split('DownloadGB</span><br/><spanclass="italic">')[1].split('<')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                if (ggn_download.length > 0 && ggn_download.length < 20) {
                                    console.log(ggn_download);
                                    localStorage.setItem('ggn_download', ggn_download);
                                }
                            }
                            var ggn_uploads = '';
                            if (typeof res.split('Uploads</span><br/><spanclass="italic">')[1] !== 'undefined') {
                                ggn_uploads = res.split('Uploads</span><br/><spanclass="italic">')[1].split('<')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                if (ggn_uploads.length > 0 && ggn_uploads.length < 20) {
                                    console.log(ggn_uploads);
                                    localStorage.setItem('ggn_uploads', ggn_uploads);
                                }
                            }
                            var ggn_snatched = '';
                            if (typeof res.split('</sup></span><br/><spanclass="italic">')[1] !== 'undefined') {
                                ggn_snatched = res.split('</sup></span><br/><spanclass="italic">')[1].split('<')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                if (ggn_snatched.length > 0 && ggn_snatched.length < 20) {
                                    console.log(ggn_snatched);
                                    localStorage.setItem('ggn_snatched', ggn_snatched);
                                }
                            }
                            var ggn_irc_lines = '';
                            if (typeof res.split('IRCLines</span><br/><spanclass="italic">')[1] !== 'undefined') {
                                ggn_irc_lines = res.split('IRCLines</span><br/><spanclass="italic">')[1].split('<')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                if (ggn_irc_lines.length > 0 && ggn_irc_lines.length < 20) {
                                    console.log(ggn_irc_lines);
                                    localStorage.setItem('ggn_irc_lines', ggn_irc_lines);
                                }
                            }
                            var ggn_forum_posts = '';
                            if (typeof res.split('ForumPosts</span><br/><spanclass="italic">')[1] !== 'undefined') {
                                ggn_forum_posts = res.split('ForumPosts</span><br/><spanclass="italic">')[1].split('<')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                if (ggn_forum_posts.length > 0 && ggn_forum_posts.length < 20) {
                                    console.log(ggn_forum_posts);
                                    localStorage.setItem('ggn_forum_posts', ggn_forum_posts);
                                }
                            }
                        }
                    }
                });
            }

            var ggn_total_points = parseInt(localStorage.getItem('ggn_total_points'));

            if (ggn_total_points > 0) {
                item.children().eq(7).append('<br><span id="ggn_more_points">' + number_format(ggn_total_points) + '</span>');

                var ggn_mouserover_content = '<div>成就分:' + ggn_total_points + '</div>';

                if (size2Bytes(localStorage.getItem('ggn_upload')) > size2Bytes('50 GiB') && size2Bytes(localStorage.getItem('ggn_upload')) < size2Bytes('100 GiB')) {
                    ggn_mouserover_content += '<div>上传成就分:' + 100 + '&nbsp;上传量:' + localStorage.getItem('ggn_upload') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('100 GiB') - size2Bytes(localStorage.getItem('ggn_upload'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_upload')) > size2Bytes('100 GiB') && size2Bytes(localStorage.getItem('ggn_upload')) < size2Bytes('250 GiB')) {
                    ggn_mouserover_content += '<div>上传成就分:' + 200 + '&nbsp;上传量:' + localStorage.getItem('ggn_upload') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('250 GiB') - size2Bytes(localStorage.getItem('ggn_upload'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_upload')) > size2Bytes('250 GiB') && size2Bytes(localStorage.getItem('ggn_upload')) < size2Bytes('500 GiB')) {
                    ggn_mouserover_content += '<div>上传成就分:' + 300 + '&nbsp;上传量:' + localStorage.getItem('ggn_upload') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('500 GiB') - size2Bytes(localStorage.getItem('ggn_upload'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_upload')) > size2Bytes('500 GiB') && size2Bytes(localStorage.getItem('ggn_upload')) < size2Bytes('1 TiB')) {
                    ggn_mouserover_content += '<div>上传成就分:' + 450 + '&nbsp;上传量:' + localStorage.getItem('ggn_upload') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('1 TiB') - size2Bytes(localStorage.getItem('ggn_upload'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_upload')) > size2Bytes('1 TiB') && size2Bytes(localStorage.getItem('ggn_upload')) < size2Bytes('2 TiB')) {
                    ggn_mouserover_content += '<div>上传成就分:' + 600 + '&nbsp;上传量:' + localStorage.getItem('ggn_upload') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('2 TiB') - size2Bytes(localStorage.getItem('ggn_upload'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_upload')) > size2Bytes('2 TiB') && size2Bytes(localStorage.getItem('ggn_upload')) < size2Bytes('4 TiB')) {
                    ggn_mouserover_content += '<div>上传成就分:' + 800 + '&nbsp;上传量:' + localStorage.getItem('ggn_upload') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('4 TiB') - size2Bytes(localStorage.getItem('ggn_upload'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_upload')) > size2Bytes('4 TiB')) {
                    ggn_mouserover_content += '<div style="color: green">上传成就分:' + 1000 + '&nbsp;上传量:' + localStorage.getItem('ggn_upload') + '</div>';
                } else {
                    ggn_mouserover_content += '<div>上传成就分:' + 0 + '&nbsp;上传量:' + localStorage.getItem('ggn_upload') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('50 GiB') - size2Bytes(localStorage.getItem('ggn_upload'))) + '</span></div>';
                }

                if (size2Bytes(localStorage.getItem('ggn_download')) > size2Bytes('50 GiB') && size2Bytes(localStorage.getItem('ggn_download')) < size2Bytes('100 GiB')) {
                    ggn_mouserover_content += '<div>下载成就分:' + 100 + '&nbsp;下载量:' + localStorage.getItem('ggn_download') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('100 GiB') - size2Bytes(localStorage.getItem('ggn_download'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_download')) > size2Bytes('100 GiB') && size2Bytes(localStorage.getItem('ggn_download')) < size2Bytes('250 GiB')) {
                    ggn_mouserover_content += '<div>下载成就分:' + 200 + '&nbsp;下载量:' + localStorage.getItem('ggn_download') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('250 GiB') - size2Bytes(localStorage.getItem('ggn_download'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_download')) > size2Bytes('250 GiB') && size2Bytes(localStorage.getItem('ggn_download')) < size2Bytes('500 GiB')) {
                    ggn_mouserover_content += '<div>下载成就分:' + 300 + '&nbsp;下载量:' + localStorage.getItem('ggn_download') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('500 GiB') - size2Bytes(localStorage.getItem('ggn_download'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_download')) > size2Bytes('500 GiB') && size2Bytes(localStorage.getItem('ggn_download')) < size2Bytes('1 TiB')) {
                    ggn_mouserover_content += '<div>下载成就分:' + 450 + '&nbsp;下载量:' + localStorage.getItem('ggn_download') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('1 TiB') - size2Bytes(localStorage.getItem('ggn_download'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_download')) > size2Bytes('1 TiB') && size2Bytes(localStorage.getItem('ggn_download')) < size2Bytes('2 TiB')) {
                    ggn_mouserover_content += '<div>下载成就分:' + 600 + '&nbsp;下载量:' + localStorage.getItem('ggn_download') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('2 TiB') - size2Bytes(localStorage.getItem('ggn_download'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_download')) > size2Bytes('2 TiB') && size2Bytes(localStorage.getItem('ggn_download')) < size2Bytes('4 TiB')) {
                    ggn_mouserover_content += '<div>下载成就分:' + 800 + '&nbsp;下载量:' + localStorage.getItem('ggn_download') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('4 TiB') - size2Bytes(localStorage.getItem('ggn_download'))) + '</span></div>';
                } else if (size2Bytes(localStorage.getItem('ggn_download')) > size2Bytes('4 TiB')) {
                    ggn_mouserover_content += '<div style="color: green">下载成就分:' + 1000 + '&nbsp;下载量:' + localStorage.getItem('ggn_download') + '</div>';
                } else {
                    ggn_mouserover_content += '<div>下载成就分:' + 0 + '&nbsp;下载量:' + localStorage.getItem('ggn_download') + '&nbsp;<span style="color:red;">离下一阶段还差' + bytes2Size(size2Bytes('50 GiB') - size2Bytes(localStorage.getItem('ggn_download'))) + '</span></div>';
                }

                if (localStorage.getItem('ggn_uploads') > 10 && localStorage.getItem('ggn_uploads') < 25) {
                    ggn_mouserover_content += '<div>发种成就分:' + 100 + '&nbsp;发种量:' + localStorage.getItem('ggn_uploads') + '&nbsp;<span style="color:red;">离下一阶段还差' + (25 - localStorage.getItem('ggn_uploads')) + '</span></div>';
                } else if (localStorage.getItem('ggn_uploads') > 25 && localStorage.getItem('ggn_uploads') < 50) {
                    ggn_mouserover_content += '<div>发种成就分:' + 200 + '&nbsp;发种量:' + localStorage.getItem('ggn_uploads') + '&nbsp;<span style="color:red;">离下一阶段还差' + (50 - localStorage.getItem('ggn_uploads')) + '</span></div>';
                } else if (localStorage.getItem('ggn_uploads') > 50 && localStorage.getItem('ggn_uploads') < 100) {
                    ggn_mouserover_content += '<div>发种成就分:' + 300 + '&nbsp;发种量:' + localStorage.getItem('ggn_uploads') + '&nbsp;<span style="color:red;">离下一阶段还差' + (100 - localStorage.getItem('ggn_uploads')) + '</span></div>';
                } else if (localStorage.getItem('ggn_uploads') > 100 && localStorage.getItem('ggn_uploads') < 250) {
                    ggn_mouserover_content += '<div>发种成就分:' + 450 + '&nbsp;发种量:' + localStorage.getItem('ggn_uploads') + '&nbsp;<span style="color:red;">离下一阶段还差' + (250 - localStorage.getItem('ggn_uploads')) + '</span></div>';
                } else if (localStorage.getItem('ggn_uploads') > 250 && localStorage.getItem('ggn_uploads') < 500) {
                    ggn_mouserover_content += '<div>发种成就分:' + 600 + '&nbsp;发种量:' + localStorage.getItem('ggn_uploads') + '&nbsp;<span style="color:red;">离下一阶段还差' + (500 - localStorage.getItem('ggn_uploads')) + '</span></div>';
                } else if (localStorage.getItem('ggn_uploads') > 500 && localStorage.getItem('ggn_uploads') < 1000) {
                    ggn_mouserover_content += '<div>发种成就分:' + 800 + '&nbsp;发种量:' + localStorage.getItem('ggn_uploads') + '&nbsp;<span style="color:red;">离下一阶段还差' + (1000 - localStorage.getItem('ggn_uploads')) + '</span></div>';
                } else if (localStorage.getItem('ggn_uploads') > 1000) {
                    ggn_mouserover_content += '<div style="color: green">发种成就分:' + 1000 + '&nbsp;发种量:' + localStorage.getItem('ggn_uploads') + '</div>';
                } else {
                    ggn_mouserover_content += '<div>发种成就分:' + 0 + '&nbsp;发种量:' + localStorage.getItem('ggn_uploads') + '&nbsp;<span style="color:red;">离下一阶段还差' + (10 - localStorage.getItem('ggn_uploads')) + '</span></div>';
                }

                if (localStorage.getItem('ggn_snatched') > 25 && localStorage.getItem('ggn_snatched') < 50) {
                    ggn_mouserover_content += '<div>snatched成就分:' + 100 + '&nbsp;snatched量:' + localStorage.getItem('ggn_snatched') + '&nbsp;<span style="color:red;">离下一阶段还差' + (50 - localStorage.getItem('ggn_snatched')) + '</span></div>';
                } else if (localStorage.getItem('ggn_snatched') > 50 && localStorage.getItem('ggn_snatched') < 100) {
                    ggn_mouserover_content += '<div>snatched成就分:' + 200 + '&nbsp;snatched量:' + localStorage.getItem('ggn_snatched') + '&nbsp;<span style="color:red;">离下一阶段还差' + (100 - localStorage.getItem('ggn_snatched')) + '</span></div>';
                } else if (localStorage.getItem('ggn_snatched') > 100 && localStorage.getItem('ggn_snatched') < 250) {
                    ggn_mouserover_content += '<div>snatched成就分:' + 300 + '&nbsp;snatched量:' + localStorage.getItem('ggn_snatched') + '&nbsp;<span style="color:red;">离下一阶段还差' + (250 - localStorage.getItem('ggn_snatched')) + '</span></div>';
                } else if (localStorage.getItem('ggn_snatched') > 250 && localStorage.getItem('ggn_snatched') < 500) {
                    ggn_mouserover_content += '<div>snatched成就分:' + 450 + '&nbsp;snatched量:' + localStorage.getItem('ggn_snatched') + '&nbsp;<span style="color:red;">离下一阶段还差' + (500 - localStorage.getItem('ggn_snatched')) + '</span></div>';
                } else if (localStorage.getItem('ggn_snatched') > 500 && localStorage.getItem('ggn_snatched') < 1000) {
                    ggn_mouserover_content += '<div>snatched成就分:' + 600 + '&nbsp;snatched量:' + localStorage.getItem('ggn_snatched') + '&nbsp;<span style="color:red;">离下一阶段还差' + (1000 - localStorage.getItem('ggn_snatched')) + '</span></div>';
                } else if (localStorage.getItem('ggn_snatched') > 1000 && localStorage.getItem('ggn_snatched') < 2000) {
                    ggn_mouserover_content += '<div>snatched成就分:' + 800 + '&nbsp;snatched量:' + localStorage.getItem('ggn_snatched') + '&nbsp;<span style="color:red;">离下一阶段还差' + (2000 - localStorage.getItem('ggn_snatched')) + '</span></div>';
                } else if (localStorage.getItem('ggn_snatched') > 2000) {
                    ggn_mouserover_content += '<div style="color: green">snatched成就分:' + 1000 + '&nbsp;snatched量:' + localStorage.getItem('ggn_snatched') + '</div>';
                } else {
                    ggn_mouserover_content += '<div>snatched成就分:' + 0 + '&nbsp;snatched量:' + localStorage.getItem('ggn_snatched') + '&nbsp;<span style="color:red;">离下一阶段还差' + (25 - localStorage.getItem('ggn_snatched')) + '</span></div>';
                }

                if (localStorage.getItem('ggn_irc_lines') > 500 && localStorage.getItem('ggn_irc_lines') < 1000) {
                    ggn_mouserover_content += '<div>irc_lines成就分:' + 100 + '&nbsp;irc_lines量:' + localStorage.getItem('ggn_irc_lines') + '&nbsp;<span style="color:red;">离下一阶段还差' + (1000 - localStorage.getItem('ggn_irc_lines')) + '</span></div>';
                } else if (localStorage.getItem('ggn_irc_lines') > 1000 && localStorage.getItem('ggn_irc_lines') < 2500) {
                    ggn_mouserover_content += '<div>irc_lines成就分:' + 200 + '&nbsp;irc_lines量:' + localStorage.getItem('ggn_irc_lines') + '&nbsp;<span style="color:red;">离下一阶段还差' + (2500 - localStorage.getItem('ggn_irc_lines')) + '</span></div>';
                } else if (localStorage.getItem('ggn_irc_lines') > 2500 && localStorage.getItem('ggn_irc_lines') < 5000) {
                    ggn_mouserover_content += '<div>irc_lines成就分:' + 300 + '&nbsp;irc_lines量:' + localStorage.getItem('ggn_irc_lines') + '&nbsp;<span style="color:red;">离下一阶段还差' + (5000 - localStorage.getItem('ggn_irc_lines')) + '</span></div>';
                } else if (localStorage.getItem('ggn_irc_lines') > 5000 && localStorage.getItem('ggn_irc_lines') < 8500) {
                    ggn_mouserover_content += '<div>irc_lines成就分:' + 450 + '&nbsp;irc_lines量:' + localStorage.getItem('ggn_irc_lines') + '&nbsp;<span style="color:red;">离下一阶段还差' + (8500 - localStorage.getItem('ggn_irc_lines')) + '</span></div>';
                } else if (localStorage.getItem('ggn_irc_lines') > 8500 && localStorage.getItem('ggn_irc_lines') < 14000) {
                    ggn_mouserover_content += '<div>irc_lines成就分:' + 600 + '&nbsp;irc_lines量:' + localStorage.getItem('ggn_irc_lines') + '&nbsp;<span style="color:red;">离下一阶段还差' + (14000 - localStorage.getItem('ggn_irc_lines')) + '</span></div>';
                } else if (localStorage.getItem('ggn_irc_lines') > 14000 && localStorage.getItem('ggn_irc_lines') < 20000) {
                    ggn_mouserover_content += '<div>irc_lines成就分:' + 800 + '&nbsp;irc_lines量:' + localStorage.getItem('ggn_irc_lines') + '&nbsp;<span style="color:red;">离下一阶段还差' + (20000 - localStorage.getItem('ggn_irc_lines')) + '</span></div>';
                } else if (localStorage.getItem('ggn_irc_lines') > 20000) {
                    ggn_mouserover_content += '<div style="color: green">irc_lines成就分:' + 1000 + '&nbsp;irc_lines量:' + localStorage.getItem('ggn_irc_lines') + '</div>';
                } else {
                    ggn_mouserover_content += '<div>irc_lines成就分:' + 0 + '&nbsp;irc_lines量:' + localStorage.getItem('ggn_irc_lines') + '&nbsp;<span style="color:red;">离下一阶段还差' + (500 - localStorage.getItem('ggn_irc_lines')) + '</span></div>';
                }

                if (localStorage.getItem('ggn_forum_posts') > 50 && localStorage.getItem('ggn_forum_posts') < 100) {
                    ggn_mouserover_content += '<div>forum_posts成就分:' + 100 + '&nbsp;forum_posts量:' + localStorage.getItem('ggn_forum_posts') + '&nbsp;<span style="color:red;">离下一阶段还差' + (100 - localStorage.getItem('ggn_forum_posts')) + '</span></div>';
                } else if (localStorage.getItem('ggn_forum_posts') > 100 && localStorage.getItem('ggn_forum_posts') < 250) {
                    ggn_mouserover_content += '<div>forum_posts成就分:' + 200 + '&nbsp;forum_posts量:' + localStorage.getItem('ggn_forum_posts') + '&nbsp;<span style="color:red;">离下一阶段还差' + (250 - localStorage.getItem('ggn_forum_posts')) + '</span></div>';
                } else if (localStorage.getItem('ggn_forum_posts') > 250 && localStorage.getItem('ggn_forum_posts') < 500) {
                    ggn_mouserover_content += '<div>forum_posts成就分:' + 300 + '&nbsp;forum_posts量:' + localStorage.getItem('ggn_forum_posts') + '&nbsp;<span style="color:red;">离下一阶段还差' + (500 - localStorage.getItem('ggn_forum_posts')) + '</span></div>';
                } else if (localStorage.getItem('ggn_forum_posts') > 500 && localStorage.getItem('ggn_forum_posts') < 1000) {
                    ggn_mouserover_content += '<div>forum_posts成就分:' + 450 + '&nbsp;forum_posts量:' + localStorage.getItem('ggn_forum_posts') + '&nbsp;<span style="color:red;">离下一阶段还差' + (1000 - localStorage.getItem('ggn_forum_posts')) + '</span></div>';
                } else if (localStorage.getItem('ggn_forum_posts') > 1000 && localStorage.getItem('ggn_forum_posts') < 2500) {
                    ggn_mouserover_content += '<div>forum_posts成就分:' + 600 + '&nbsp;forum_posts量:' + localStorage.getItem('ggn_forum_posts') + '&nbsp;<span style="color:red;">离下一阶段还差' + (2500 - localStorage.getItem('ggn_forum_posts')) + '</span></div>';
                } else if (localStorage.getItem('ggn_forum_posts') > 2500 && localStorage.getItem('ggn_forum_posts') < 5000) {
                    ggn_mouserover_content += '<div>forum_posts成就分:' + 800 + '&nbsp;forum_posts量:' + localStorage.getItem('ggn_forum_posts') + '&nbsp;<span style="color:red;">离下一阶段还差' + (5000 - localStorage.getItem('ggn_forum_posts')) + '</span></div>';
                } else if (localStorage.getItem('ggn_forum_posts') > 5000) {
                    ggn_mouserover_content += '<div style="color: green">forum_posts成就分:' + 1000 + '&nbsp;forum_posts量:' + localStorage.getItem('ggn_forum_posts') + '</div>';
                } else {
                    ggn_mouserover_content += '<div>forum_posts成就分:' + 0 + '&nbsp;forum_posts量:' + localStorage.getItem('ggn_forum_posts') + '&nbsp;<span style="color:red;">离下一阶段还差' + (50 - localStorage.getItem('ggn_forum_posts')) + '</span></div>';
                }
            }

        }

        if (parseUrl(site_url).host.replace(/www\./, '') === 'wintersakura.net') {
            //处理冬樱的做种积分  wsn_bonus1 是魔力值  wsn_bonus2 是做种积分
            if (localStorage.getItem('wsn_bonus1') === null || localStorage.getItem('wsn_bonus2') === null || (localStorage.getItem('wsn_bonus1') != bonus)) {
                localStorage.setItem('wsn_bonus1', bonus);
                $.ajax({
                    url: 'https://wintersakura.net/index.php',
                    async: false,
                    success: function (res) {
                        if (res.indexOf('userdetails.php?id=') !== -1) {
                            // 有用户页表示获取成功
                            if (res.indexOf('做种积分</font>: ') !== -1) {
                                var wsn_bonus2 = res.split('做种积分</font>: ');
                                if (typeof wsn_bonus2[1] !== 'undefined') {
                                    wsn_bonus2 = wsn_bonus2[1].split(' ')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                    if (!isNaN(wsn_bonus2)) {
                                        localStorage.setItem('wsn_bonus2', wsn_bonus2);
                                    }
                                }
                            }
                        }
                    }
                });
            }

            var wsn_bonus2 = parseInt(localStorage.getItem('wsn_bonus2'));

            if (wsn_bonus2 > 0) {
                item.children().eq(7).append('<br><span>' + number_format(wsn_bonus2) + '</span>');
            }
        }

        if (parseUrl(site_url).host.replace(/www\./, '') === 'hdvideo.one') {
            //处理HDVIDEO的做种积分  hvo_bonus1 是魔力值  hvo_bonus2 是做种积分
            if (localStorage.getItem('hvo_bonus1') === null || localStorage.getItem('hvo_bonus2') === null || (localStorage.getItem('hvo_bonus1') != bonus)) {
                localStorage.setItem('hvo_bonus1', bonus);
                $.ajax({
                    url: 'https://hdvideo.one/index.php',
                    async: false,
                    success: function (res) {
                        if (res.indexOf('userdetails.php?id=') !== -1) {
                            // 有用户页表示获取成功
                            if (res.indexOf('做种积分</font>: ') !== -1) {
                                var hvo_bonus2 = res.split('做种积分</font>: ');
                                if (typeof hvo_bonus2[1] !== 'undefined') {
                                    hvo_bonus2 = hvo_bonus2[1].split(' ')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                    if (!isNaN(hvo_bonus2)) {
                                        localStorage.setItem('hvo_bonus2', hvo_bonus2);
                                    }
                                }
                            }
                        }
                    }
                });
            }

            var hvo_bonus2 = parseInt(localStorage.getItem('hvo_bonus2'));

            if (hvo_bonus2 > 0) {
                item.children().eq(7).append('<br><span>' + number_format(hvo_bonus2) + '</span>');
            }
        }

        if (parseUrl(site_url).host.replace(/www\./, '') === 'haidan.video') {
            //处理海胆的等级积分  hdv_bonus1 是魔力值  hdv_bonus2 是等级积分
            if (localStorage.getItem('hdv_bonus1') === null || localStorage.getItem('hdv_bonus2') === null || (localStorage.getItem('hdv_bonus1') != bonus)) {
                localStorage.setItem('hdv_bonus1', bonus);
                $.ajax({
                    url: 'https://www.haidan.video/index.php',
                    async: false,
                    success: function (res) {
                        if (res.indexOf('userdetails.php?id=') !== -1) {
                            // 有用户页表示获取成功
                            if (res.indexOf('等级积分: </font>') !== -1) {
                                var hdv_bonus2 = res.split('等级积分: </font>\n</a>\n<span> ');
                                if (typeof hdv_bonus2[1] !== 'undefined') {
                                    hdv_bonus2 = hdv_bonus2[1].split(' ')[0].replace(/,/g, '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                                    if (!isNaN(hdv_bonus2)) {
                                        localStorage.setItem('hdv_bonus2', hdv_bonus2);
                                    }
                                }
                            }
                        }
                    }
                });
            }

            var hdv_bonus2 = parseInt(localStorage.getItem('hdv_bonus2'));

            if (hdv_bonus2 > 0) {
                item.children().eq(7).append('<br><span>' + number_format(hdv_bonus2) + '</span>');
            }
        }

        for (j = 0; j < site_rank.length; j++) {
            rank_flag = false;
            //时间到了还没达到上传或者下载的
            if (site_rank[j]['time'] + register_time < (Date.parse(new Date()) / 1000)) {
                if (typeof site_rank[j]['upload'] !== 'undefined') {
                    if (site_rank[j]['upload'] > site_rank[j]['ratio'] * site_rank[j]['download']) {
                        if (upload < site_rank[j]['upload']) {
                            vender_list('升级还差' + bytes2Size(site_rank[j]['upload'] - upload) + '↑<br>', 1, item);
                        }
                    } else {
                        if (upload < site_rank[j]['ratio'] * site_rank[j]['download']) {
                            vender_list('升级还差' + bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download'] - upload) + '↑<br>', 1, item);
                        }
                    }
                } else {
                    if (upload < site_rank[j]['ratio'] * site_rank[j]['download']) {
                        vender_list('升级还差' + bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download'] - upload) + '↑<br>', 1, item);
                    }
                }

                if (download < site_rank[j]['download']) {
                    vender_list('升级还差' + bytes2Size(site_rank[j]['download'] - download) + '↓<br>', 1, item);
                }

                if (typeof site_rank[j]['bonus'] !== 'undefined') {
                    if (bonus < site_rank[j]['bonus']) {
                        vender_list('升级还差' + (site_rank[j]['bonus'] - bonus) + '魔力值<br>', 1, item);
                    }
                }
                if (typeof site_rank[j]['bonus2'] !== 'undefined') {
                    if (site_name === 'springsunday.net') {
                        if (parseInt(localStorage.getItem('ssd_bonus2')) > 0) {
                            if (parseInt(localStorage.getItem('ssd_bonus2')) < site_rank[j]['bonus2']) {
                                vender_list('升级还差' + (site_rank[j]['bonus2'] - parseInt(localStorage.getItem('ssd_bonus2'))) + '做种积分<br>', 1, item);
                            }
                        } else {
                            vender_list('获取做种积分失败<br>', 1, item);
                        }
                    } else if (site_name === 'wintersakura.net') {
                        if (parseInt(localStorage.getItem('wsn_bonus2')) > 0) {
                            if (parseInt(localStorage.getItem('wsn_bonus2')) < site_rank[j]['bonus2']) {
                                vender_list('升级还差' + (site_rank[j]['bonus2'] - parseInt(localStorage.getItem('wsn_bonus2'))) + '做种积分<br>', 1, item);
                            }
                        } else {
                            vender_list('获取做种积分失败<br>', 1, item);
                        }
                    } else if (site_name === 'hdvideo.one') {
                        if (parseInt(localStorage.getItem('hvo_bonus2')) > 0) {
                            if (parseInt(localStorage.getItem('hvo_bonus2')) < site_rank[j]['bonus2']) {
                                vender_list('升级还差' + (site_rank[j]['bonus2'] - parseInt(localStorage.getItem('hvo_bonus2'))) + '做种积分<br>', 1, item);
                            }
                        } else {
                            vender_list('获取做种积分失败<br>', 1, item);
                        }
                    }
                }
                if (typeof site_rank[j]['bonus3'] !== 'undefined') {
                    if (parseInt(localStorage.getItem('ggn_total_points')) > 0) {
                        if (parseInt(localStorage.getItem('ggn_total_points')) < site_rank[j]['bonus3']) {
                            vender_list('升级还差' + (site_rank[j]['bonus3'] - parseInt(localStorage.getItem('ggn_total_points'))) + '成就积分<br>', 1, item);
                        }
                    } else {
                        vender_list('获取成就积分失败<br>', 1, item);
                    }
                }
                if (typeof site_rank[j]['bonus4'] !== 'undefined') {
                    if (site_name === 'haidan.video') {
                        if (parseInt(localStorage.getItem('hdv_bonus2')) > 0) {
                            if (parseInt(localStorage.getItem('hdv_bonus2')) < site_rank[j]['bonus4']) {
                                vender_list('升级还差' + (site_rank[j]['bonus4'] - parseInt(localStorage.getItem('hdv_bonus2'))) + '等级积分<br>', 1, item);
                            }
                        } else {
                            vender_list('获取等级积分失败<br>', 1, item);
                        }
                    }
                }
                if (rank_flag) {
                    break;
                }
            } else {
                //如果没有的话  就用最近的
                vender_list(timestamp2Date(site_rank[j]['time'] + register_time) + '前达到', 4, item);

                if (typeof site_rank[j]['upload'] !== 'undefined') {
                    if (site_rank[j]['upload'] > site_rank[j]['ratio'] * site_rank[j]['download']) {
                        if (upload < site_rank[j]['upload']) {
                            vender_list(bytes2Size(site_rank[j]['upload']) + '↑', 3, item);
                            vender_list('&nbsp;&nbsp;升级还差' + bytes2Size(site_rank[j]['upload'] - upload) + '↑', 1, item);
                        } else {
                            vender_list(bytes2Size(site_rank[j]['upload']) + '↑', 2, item);
                        }
                    } else {
                        if (upload < site_rank[j]['ratio'] * site_rank[j]['download']) {
                            vender_list(bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download']) + '↑', 3, item);
                            vender_list('&nbsp;&nbsp;升级还差' + bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download'] - upload) + '↑', 1, item);
                        } else {
                            vender_list(bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download']) + '↑', 2, item);
                        }
                    }
                } else {
                    if (upload < (site_rank[j]['ratio'] * site_rank[j]['download'])) {
                        vender_list(bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download']) + '↑', 3, item);
                        vender_list('&nbsp;&nbsp;升级还差' + bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download'] - upload) + '↑', 1, item);
                    } else {
                        vender_list(bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download']) + '↑', 2, item);
                    }
                }

                if (download < site_rank[j]['download']) {
                    vender_list(bytes2Size(site_rank[j]['download']) + '↓', 3, item);
                    vender_list('&nbsp;&nbsp;升级还差' + bytes2Size(site_rank[j]['download'] - download) + '↓', 1, item);
                } else {
                    vender_list(bytes2Size(site_rank[j]['download']) + '↓', 2, item);
                }
                if (typeof site_rank[j]['bonus'] !== 'undefined') {
                    if (bonus < site_rank[j]['bonus']) {
                        vender_list(site_rank[j]['bonus'] + '魔力值', 3, item);
                        vender_list('&nbsp;&nbsp;升级还差' + (site_rank[j]['bonus'] - bonus) + '魔力值<br>', 1, item);
                    } else {
                        vender_list(site_rank[j]['bonus'] + '魔力值', 2, item);
                    }
                }
                if (typeof site_rank[j]['bonus2'] !== 'undefined') {
                    if (site_name === 'springsunday.net') {
                        if (parseInt(localStorage.getItem('ssd_bonus2')) > 0) {
                            if (parseInt(localStorage.getItem('ssd_bonus2')) < site_rank[j]['bonus2']) {
                                vender_list(site_rank[j]['bonus2'] + '做种积分', 3, item);
                                vender_list('&nbsp;&nbsp;升级还差' + (site_rank[j]['bonus2'] - parseInt(localStorage.getItem('ssd_bonus2'))) + '做种积分<br>', 1, item);
                            } else {
                                vender_list(site_rank[j]['bonus2'] + '做种积分', 2, item);
                            }
                        } else {
                            vender_list('获取做种积分失败<br>', 1, item);
                        }
                    } else if (site_name === 'wintersakura.net') {
                        if (parseInt(localStorage.getItem('wsn_bonus2')) > 0) {
                            if (parseInt(localStorage.getItem('wsn_bonus2')) < site_rank[j]['bonus2']) {
                                vender_list(site_rank[j]['bonus2'] + '做种积分', 3, item);
                                vender_list('&nbsp;&nbsp;升级还差' + (site_rank[j]['bonus2'] - parseInt(localStorage.getItem('wsn_bonus2'))) + '做种积分<br>', 1, item);
                            } else {
                                vender_list(site_rank[j]['bonus2'] + '做种积分', 2, item);
                            }
                        } else {
                            vender_list('获取做种积分失败<br>', 1, item);
                        }
                    } else if (site_name === 'hdvideo.one') {
                        if (parseInt(localStorage.getItem('hvo_bonus2')) > 0) {
                            if (parseInt(localStorage.getItem('hvo_bonus2')) < site_rank[j]['bonus2']) {
                                vender_list(site_rank[j]['bonus2'] + '做种积分', 3, item);
                                vender_list('&nbsp;&nbsp;升级还差' + (site_rank[j]['bonus2'] - parseInt(localStorage.getItem('hvo_bonus2'))) + '做种积分<br>', 1, item);
                            } else {
                                vender_list(site_rank[j]['bonus2'] + '做种积分', 2, item);
                            }
                        } else {
                            vender_list('获取做种积分失败<br>', 1, item);
                        }
                    }
                }
                if (typeof site_rank[j]['bonus4'] !== 'undefined') {
                    if (site_name === 'haidan.video') {
                        if (parseInt(localStorage.getItem('hdv_bonus2')) > 0) {
                            if (parseInt(localStorage.getItem('hdv_bonus2')) < site_rank[j]['bonus4']) {
                                vender_list(site_rank[j]['bonus4'] + '等级积分', 3, item);
                                vender_list('&nbsp;&nbsp;升级还差' + (site_rank[j]['bonus4'] - parseInt(localStorage.getItem('hdv_bonus2'))) + '等级积分<br>', 1, item);
                            } else {
                                vender_list(site_rank[j]['bonus4'] + '等级积分', 2, item);
                            }
                        } else {
                            vender_list('获取等级积分失败<br>', 1, item);
                        }
                    }
                }
                break;
            }
        }


        let mouseover_content = '';
        for (j = 0; j < site_rank.length; j++) {
            let calendar_title = '';
            let calendar_color = 'green';
            if (site_rank[j]['time'] + register_time < (Date.parse(new Date()) / 1000)) {
                mouseover_content += '<span style="color: red;" id="mouseover_' + count++ + '">✘</span><span style="color: grey">' + timestamp2Date(site_rank[j]['time'] + register_time) + '&nbsp;:&nbsp;' + site_rank[j]['name'] + '&nbsp;/&nbsp;';
            } else {
                mouseover_content += '<span style="color: red;" id="mouseover_' + count++ + '">✘</span>' + timestamp2Date(site_rank[j]['time'] + register_time) + '&nbsp;:&nbsp;' + site_rank[j]['name'] + '&nbsp;/&nbsp;';
            }
            var need_upload = 0;
            var need_download = 0;
            var need_bonus = 0;
            if (typeof site_rank[j]['upload'] !== 'undefined') {
                if (site_rank[j]['upload'] > site_rank[j]['ratio'] * site_rank[j]['download']) {
                    if (site_rank[j]['upload'] !== 0) {
                        mouseover_content += '上传' + bytes2Size(site_rank[j]['upload']) + '&nbsp;/&nbsp;';
                    }
                    need_upload = site_rank[j]['upload'];
                } else {
                    if (site_rank[j]['ratio'] * site_rank[j]['download'] !== 0) {
                        mouseover_content += '上传' + bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download']) + '&nbsp;/&nbsp;';
                    }
                    need_upload = site_rank[j]['ratio'] * site_rank[j]['download'];
                }
            } else {
                if (site_rank[j]['ratio'] * site_rank[j]['download'] !== 0) {
                    mouseover_content += '上传' + bytes2Size(site_rank[j]['ratio'] * site_rank[j]['download']) + '&nbsp;/&nbsp;';
                }
                need_upload = site_rank[j]['ratio'] * site_rank[j]['download'];
            }

            if (site_rank[j]['download'] !== 0) {
                mouseover_content += '下载' + bytes2Size(site_rank[j]['download']) + '&nbsp;/&nbsp;';
            }
            if (site_rank[j]['download'] === 0) {
                need_download = -1;
            } else {
                need_download = site_rank[j]['download'];
            }

            if (typeof site_rank[j]['bonus'] !== 'undefined') {
                mouseover_content += '魔力值' + site_rank[j]['bonus'] + '&nbsp;/&nbsp;';
                need_bonus = site_rank[j]['bonus'];
            }

            if (typeof site_rank[j]['bonus2'] !== 'undefined') {
                mouseover_content += '做种积分' + site_rank[j]['bonus2'] + '&nbsp;/&nbsp;';
                if (site_name === 'springsunday.net') {
                    bonus = parseInt(localStorage.getItem('ssd_bonus2'));
                } else if (site_name === 'wintersakura.net') {
                    bonus = parseInt(localStorage.getItem('wsn_bonus2'));
                } else if (site_name === 'hdvideo.one') {
                    bonus = parseInt(localStorage.getItem('hvo_bonus2'));
                }
                need_bonus = site_rank[j]['bonus2'];
            }

            if (typeof site_rank[j]['bonus4'] !== 'undefined') {
                mouseover_content += '等级积分' + site_rank[j]['bonus4'] + '&nbsp;/&nbsp;';
                if (site_name === 'haidan.video') {
                    bonus = parseInt(localStorage.getItem('hdv_bonus2'));
                }
                need_bonus = site_rank[j]['bonus4'];
            }

            if (need_bonus > 0) {
                if (need_bonus < bonus) {
                    if (need_download < download && need_upload < upload) {
                        mouseover_content = mouseover_content.replace('color: red;" id="mouseover_' + (count - 1) + '">✘', 'color: green;" id="mouseover_' + (count - 1) + '">✔');
                    } else {
                        calendar_title += '还差' + ((need_upload - upload) > 0 ? (bytes2Size(need_upload - upload) + '↑/') : '') + ((need_download - download) > 0 ? (bytes2Size(need_download - download) + '↓') : '');
                        calendar_color = 'orangered';
                    }
                } else {
                    if (need_download < download && need_upload < upload) {
                        calendar_title += '还差' + (need_bonus - bonus) + (typeof site_rank[j]['bonus'] !== 'undefined' ? '魔力值' : '做种积分');
                        calendar_color = 'orangered';
                    } else {
                        calendar_title += '还差' + ((need_upload - upload) > 0 ? (bytes2Size(need_upload - upload) + '↑/') : '') + ((need_download - download) > 0 ? (bytes2Size(need_download - download) + '↓/') : '') + (need_bonus - bonus) + (typeof site_rank[j]['bonus'] !== 'undefined' ? '魔力值' : '做种积分');
                        calendar_color = 'orangered';
                    }
                }
            } else {
                if (need_download < download && need_upload < upload) {
                    mouseover_content = mouseover_content.replace('color: red;" id="mouseover_' + (count - 1) + '">✘', 'color: green;" id="mouseover_' + (count - 1) + '">✔');
                } else {
                    calendar_title += '还差' + ((need_upload - upload) > 0 ? (bytes2Size(need_upload - upload) + '↑') : '') + ((need_download - download) > 0 ? (bytes2Size(need_download - download) + '↓/') : '');
                    calendar_color = 'orangered';
                }
            }


            if (site_rank[j]['privilege']) {
                if (parseUrl(site_url).host.replace(/www\./, '') === 'gazellegames.net') {
                    if (localStorage.getItem('ggn_total_points') > site_rank[j]['bonus3']) {
                        ggn_mouserover_content += '<br><span style="color: green">' + site_rank[j]['name'] + '</span>:' + site_rank[j]['privilege'].split('；').join('/');
                    } else {
                        ggn_mouserover_content += '<br><span style="color: red">' + site_rank[j]['name'] + '</span>:' + site_rank[j]['privilege'].split('；').join('/');
                    }
                } else {
                    mouseover_content += site_rank[j]['privilege'].split('；').join('/');
                }
            }
            mouseover_content += '</span><br>';

            if (calendar_title.substr(calendar_title.length - 1, 1) === '/') {
                calendar_title = calendar_title.substr(0, calendar_title.length - 1);
            }
            calendar_title = calendar_title + '升级' + site_rank[j]['name'];
            calendar_event.push({
                'title': '<img style="max-height: 14px;" src="' + site_avatar_img + '">' + site_name + '<br>' + calendar_title,
                'start': timestamp2Date(site_rank[j]['time'] + register_time),
                'color': calendar_color,
                url: site_url
            })
        }

        if (mouseover_content) {
            if (parseUrl(site_url).host.replace(/www\./, '') === 'gazellegames.net') {
                mouseover_content = ggn_mouserover_content;
            }
            let mouserover_div = document.createElement('div');
            item.children().eq(2).append(mouserover_div);
            $(mouserover_div).attr('style', 'position: absolute; background-color: white;');
            item.children().eq(2).on('mouseover', function () {
                mouserover_div.style.left = event.clientX;
                mouserover_div.style.top = event.clientY;
                mouserover_div.style.display = 'block';
                mouserover_div.style.zIndex = '999';
                mouserover_div.style.border = '1px solid black';
                $(mouserover_div).html(mouseover_content);
            });

            item.children().eq(2).on('mouseout', function () {
                mouserover_div.style.display = 'none';
                mouserover_div.innerHTML = '';
            });
        }

    }

    var calendarEl = $('.v-content__wrap')[0];
    calendar = new FullCalendar.Calendar(calendarEl, {
        //height: 10,
        locale: 'zh-cn',
        editable: false,
        selectable: true,
        businessHours: true,
        dayMaxEvents: false,
        eventContent: function (arg, createElement) {
            var italicEl = document.createElement('span');
            italicEl.style = 'font-size:14px;display:block;white-space:pre-wrap;overflow:hidden;';
            italicEl.innerHTML = arg.event._def.title
            var arrayOfDomNodes = [italicEl]
            return {
                domNodes: arrayOfDomNodes
            }
        },
        events: calendar_event,
    });
    //calendar.render();
}


function size2Bytes(size) {
    if (size.indexOf('KiB') !== -1 || size.indexOf('KB') !== -1) {
        return parseFloat(size) * Math.pow(2, 10);
    }
    if (size.indexOf('MiB') !== -1 || size.indexOf('MB') !== -1) {
        return parseFloat(size) * Math.pow(2, 20);
    }
    if (size.indexOf('GiB') !== -1 || size.indexOf('GB') !== -1) {
        return parseFloat(size) * Math.pow(2, 30);
    }
    if (size.indexOf('TiB') !== -1 || size.indexOf('TB') !== -1) {
        return parseFloat(size) * Math.pow(2, 40);
    }
    if (size.indexOf('PiB') !== -1 || size.indexOf('PB') !== -1) {
        return parseFloat(size) * Math.pow(2, 50);
    }
    return 0;
}

function bytes2Size(bytes) {
    if (isNaN(bytes)) {
        return '';
    }
    var symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var exp = Math.floor(Math.log(bytes) / Math.log(2));
    if (exp < 1) {
        exp = 0;
    }
    var i = Math.floor(exp / 10);
    bytes = bytes / Math.pow(2, 10 * i);

    if (bytes.toString().length > bytes.toFixed(2).toString().length) {
        bytes = bytes.toFixed(2);
    }
    return bytes + ' ' + symbols[i];
}

function timestamp2Date(timestamp) {
    var date = new Date(timestamp * 1000);
    return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
}

function loadJS(url, callback) {
    var script = document.createElement('script'),
        fn = callback || function () {
        };
    script.type = 'text/javascript';
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                fn();
            }
        };
    } else {
        script.onload = function () {
            fn();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function vender_list(content, type, item) {
    rank_flag = true;
    if (type === 1) {
        //时间满足了  但数据不够的
        if (item.children().eq(2).find('span').length > 0) {
            item.children().eq(2).append('<span style="color: orangered">' + content + '</span>');
        } else {
            item.children().eq(2).append('<br><span style="color: orangered">' + content + '</span>');
        }
    } else if (type === 2) {
        item.children().eq(2).append('<br><span style="color: green">' + content + '</span>');
    } else if (type === 3) {
        item.children().eq(2).append('<br><span style="color: orangered">' + content + '</span>');
    } else {
        item.children().eq(2).append('<br><span>' + content + '</span>');
    }
}

function parseUrl(url) {
    let urlObj = {
        protocol: /^(.+)\:\/\//,
        host: /\:\/\/(.+?)[\?\#\s\/]/,
        path: /\w(\/.*?)[\?\#\s]/,
        query: /\?(.+?)[\#\/\s]/,
        hash: /\#(\w+)\s$/
    }
    url += ' '

    function formatQuery(str) {
        return str.split('&').reduce((a, b) => {
            let arr = b.split('=')
            a[arr[0]] = arr[1]
            return a
        }, {})
    }

    for (let key in urlObj) {
        let pattern = urlObj[key]
        urlObj[key] = key === 'query' ? (pattern.exec(url) && formatQuery(pattern.exec(url)[1])) : (pattern.exec(url) && pattern.exec(url)[1])
    }
    return urlObj
}

function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.ceil(n * k) / k;
        };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function getDate() {
    var date, year, month, day, hour, minute, second;
    date = new Date();
    year = date.getFullYear();
    month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    day = date.getDate < 10 ? "0" + date.getDate() : date.getDate();
    hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return year + "-" + month + "-" + day + "_" + hour + "-" + minute + "-" + second;
}

function getCheckInConfig(site_url) {
    var url = '';
    var callback = '';
    site_url = parseUrl(site_url).host.replace(/www\./, '');
    switch (site_url) {
        case '52pt.site' :
            callback = function (item2) {
                check_in_list.push('i52pt_site');
                $.get('https://52pt.site/bakatest.php', function (res) {
                    if (res.indexOf('name="questionid" value="') !== -1) {
                        var question_id = res.split('name="questionid" value="');
                        if (typeof question_id[1] !== 'undefined') {
                            question_id = question_id[1].split('"')[0];
                            if (!isNaN(question_id)) {
                                $.post('https://52pt.site/bakatest.php', {
                                    wantskip: '不会',
                                    choice: [1],
                                    questionid: question_id
                                })
                            }
                        }
                    }
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    check_in.i52pt_site = (new Date().getMonth() + 1) + '' + new Date().getDate();
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove('i52pt_site');
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                })
            };
            break;
        case 'pt.btschool.club' :
            url = 'https://pt.btschool.club/index.php?action=addbonus';
            break;
        case 'chdbits.co' :
            callback = function (item2) {
                check_in_list.remove('chdbits_co');
                $.get('https://chdbits.co/bakatest.php', function (res) {
                    if (res.indexOf('name="questionid" value="') !== -1) {
                        var question_id = res.split('name="questionid" value="');
                        if (typeof question_id[1] !== 'undefined') {
                            question_id = question_id[1].split('"')[0];
                            if (!isNaN(question_id)) {
                                $.post('https://chdbits.co/bakatest.php', {
                                    wantskip: '不会',
                                    choice: [1],
                                    questionid: question_id
                                }, function () {
                                    var check_in = localStorage.getItem('check_in');
                                    if (check_in === null) {
                                        check_in = {};
                                    } else {
                                        check_in = JSON.parse(check_in);
                                    }
                                    check_in.chdbits_co = (new Date().getMonth() + 1) + '' + new Date().getDate();
                                    localStorage.setItem('check_in', JSON.stringify(check_in));
                                    check_in_list.remove('chdbits_co');
                                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                                })
                            }
                        }
                    }
                })
            };
            break;
        case 'discfan.net' :
            url = 'https://discfan.net/attendance.php';
            break;
        case 'haidan.video' :
            url = 'https://www.haidan.video/signin.php';
            break;
        case 'hddolby.com' :
            url = 'https://www.hddolby.com/attendance.php';
            break;
        case 'hdarea.co' :
            callback = function (item2) {
                check_in_list.push('hdarea_co');
                $.post('https://www.hdarea.co/sign_in.php', {action: 'sign_in'}, function () {
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    check_in.hdarea_co = (new Date().getMonth() + 1) + '' + new Date().getDate();
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove('hdarea_co');
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                });
            };
            break;
        case 'hdatmos.club' :
            url = 'https://hdatmos.club/attendance.php';
            break;
        case 'hdchina.org' :
            callback = function (item2) {
                check_in_list.push('hdchina_org');
                $.get('https://hdchina.org/', function (res) {
                    if (res.indexOf('<meta name="x-csrf" content="') !== -1) {
                        var csrf = res.split('<meta name="x-csrf" content="');
                        if (typeof csrf[1] !== 'undefined') {
                            csrf = csrf[1].split('"')[0];
                            if (csrf.length > 0) {
                                $.post('https://hdchina.org/plugin_sign-in.php?cmd=signin', {csrf: csrf}, function () {
                                    var check_in = localStorage.getItem('check_in');
                                    if (check_in === null) {
                                        check_in = {};
                                    } else {
                                        check_in = JSON.parse(check_in);
                                    }
                                    check_in.hdchina_org = (new Date().getMonth() + 1) + '' + new Date().getDate();
                                    localStorage.setItem('check_in', JSON.stringify(check_in));
                                    check_in_list.remove('hdchina_org');
                                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                                })
                            }
                        }
                    }
                })
            };
            break;
        case 'hdcity.city' :
            url = 'https://hdcity.city/sign';
            break;
        case 'hdhome.org' :
            url = 'https://hdhome.org/attendance.php';
            break;
        case 'pt.hdupt.com' :
            callback = function (item2) {
                check_in_list.remove('pt_hdupt_com');
                $.post('https://pt.hdupt.com/added.php', {action: 'qiandao'}, function () {
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    check_in.pt_hdupt_com = (new Date().getMonth() + 1) + '' + new Date().getDate();
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove('pt_hdupt_com');
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                });
            };
            break;
        case 'hdzone.me' :
            url = 'https://hdzone.me/attendance.php';
            break;
        case 'htpt.cc' :
            url = 'https://www.htpt.cc/attendance.php';
            break;
        case 'lemonhd.org' :
            url = 'https://lemonhd.org/attendance.php';
            break;
        case 'nicept.net' :
            url = 'https://www.nicept.net/attendance.php';
            break;
        case 'ourbits.club' :
            url = 'https://ourbits.club/attendance.php';
            break;
        case 'pterclub.com' :
            url = 'https://pterclub.com/attendance-ajax.php';
            break;
        case 'pthome.net' :
            url = 'https://pthome.net/attendance.php';
            break;
        case 'pttime.org' :
            url = 'https://www.pttime.org/attendance.php';
            break;
        case 'totheglory.im' :
            callback = function (item2) {
                check_in_list.remove('totheglory_im');
                $.get('https://totheglory.im', function (res) {
                    if (res.indexOf('$.post("signed.php", {') !== -1) {
                        var param = res.split('$.post("signed.php", {');
                        if (typeof param[1] !== 'undefined') {
                            if (res.indexOf('},') !== -1) {
                                param = param[1].split('},');
                                if (typeof param[0] !== 'undefined') {
                                    param = param[0].replace(/:/g, '=').replace('/,/g', ';');
                                    eval(param);
                                    if (typeof signed_timestamp !== 'undefined' && typeof signed_token !== 'undefined') {
                                        $.post("https://totheglory.im/signed.php", {
                                            signed_timestamp: signed_timestamp,
                                            signed_token: signed_token
                                        }, function () {
                                            var check_in = localStorage.getItem('check_in');
                                            if (check_in === null) {
                                                check_in = {};
                                            } else {
                                                check_in = JSON.parse(check_in);
                                            }
                                            check_in.totheglory_im = (new Date().getMonth() + 1) + '' + new Date().getDate();
                                            localStorage.setItem('check_in', JSON.stringify(check_in));
                                            check_in_list.remove('totheglory_im');
                                            item2.find('.caption').after('<span style="color:green;">✔</span>');
                                        });
                                    }
                                }
                            }
                        }
                    }
                })
            };
            break;
        case 'yingk.com' :
            callback = function (item2) {
                check_in_list.remove('yingk_com');
                $.get('https://yingk.com/bakatest.php', function (res) {
                    if (res.indexOf('name="questionid" value="') !== -1) {
                        var question_id = res.split('name="questionid" value="');
                        if (typeof question_id[1] !== 'undefined') {
                            question_id = question_id[1].split('"')[0];
                            if (!isNaN(question_id)) {
                                $.post('https://yingk.com/bakatest.php', {
                                    wantskip: '不会',
                                    choice: [1],
                                    questionid: question_id
                                }, function () {
                                    var check_in = localStorage.getItem('check_in');
                                    if (check_in === null) {
                                        check_in = {};
                                    } else {
                                        check_in = JSON.parse(check_in);
                                    }
                                    check_in.yingk_com = (new Date().getMonth() + 1) + '' + new Date().getDate();
                                    localStorage.setItem('check_in', JSON.stringify(check_in));
                                    check_in_list.remove('yingk_com');
                                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                                })
                            }
                        }
                    }
                })
            };
            break;
        case 'pt.soulvoice.club' :
            url = 'https://pt.soulvoice.club/attendance.php';
            break;
        case '1ptba.com' :
            url = 'https://1ptba.com/attendance.php';
            break;
        case 'wintersakura.net' :
            // url = 'https://wintersakura.net/attendance.php';
            callback = function (item2) {
                window.open("https://wintersakura.net/attendance.php", "_blank");
                var check_in = localStorage.getItem('check_in');
                if (check_in === null) {
                    check_in = {};
                } else {
                    check_in = JSON.parse(check_in);
                }
                check_in.wintersakura_net = (new Date().getMonth() + 1) + '' + new Date().getDate();
                localStorage.setItem('check_in', JSON.stringify(check_in));
                check_in_list.remove('wintersakura_net');
                item2.find('.caption').after('<span style="color:green;">✔</span>');
            };
            break;
        case 'hdvideo.one' :
            url = 'https://hdvideo.one/attendance.php';
            break;
        case 'hdtime.org' :
            url = 'https://hdtime.org/attendance.php';
            break;
        case 'piggo.me' :
            // url = 'https://piggo.me/attendance.php';
            callback = function (item2) {
                window.open("https://piggo.me/attendance.php", "_blank");
                var check_in = localStorage.getItem('check_in');
                if (check_in === null) {
                    check_in = {};
                } else {
                    check_in = JSON.parse(check_in);
                }
                check_in.piggo_me = (new Date().getMonth() + 1) + '' + new Date().getDate();
                localStorage.setItem('check_in', JSON.stringify(check_in));
                check_in_list.remove('piggo_me');
                item2.find('.caption').after('<span style="color:green;">✔</span>');
            };
            break;
        case 'hhanclub.top' :
            url = 'https://hhanclub.top/attendance.php';
        case 'audiences.me' :
            url = 'https://audiences.me/attendance.php';
    }
    return {url: url, callback: callback};
}

function getSiteRank(site_url) {
    site_url = parseUrl(site_url).host.replace(/www\./, '');
    let siteConfig = getSiteConfig();
    let config = siteConfig[site_url];
    if (config !== undefined && config.ranks !== undefined) {
        config.name = site_url;
        return config;
    }
    return undefined;
}

function getSiteConfig() {
    return {
        "beitai.pt": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>',
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color=\'green\'">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                }
            ]
        },
        "kp.m-team.cc": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('200 GiB'),
                    'ratio': 2,
                    'privilege': '可以使用匿名發表候選種子；可以上傳字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('400 GiB'),
                    'ratio': 3,
                    'privilege': '可以發送邀請；可以管理自己上傳的字幕；可以檢視別人的下載紀錄。（當對方的隱私權設定不為強才會生效）；可以使用個性條'
                },
                {
                    'name': 'Crazy User',
                    'time': 12 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 4,
                    'privilege': ''
                },
                {
                    'name': 'Insane User',
                    'time': 16 * 7 * 86400,
                    'download': size2Bytes('800 GiB'),
                    'ratio': 5,
                    'privilege': '可以檢視排行榜'
                },
                {
                    'name': 'Veteran User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('1000 GiB'),
                    'ratio': 6,
                    'privilege': '<span style="color:green"> 封存帳號（在控制面板）後不會被刪除帳號</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 24 * 7 * 86400,
                    'download': size2Bytes('2000 GiB'),
                    'ratio': 7,
                    'privilege': '<span style="color:green">帳號永遠保留</span>'
                },
                {
                    'name': 'Ultimate User',
                    'time': 28 * 7 * 86400,
                    'download': size2Bytes('2500 GiB'),
                    'ratio': 8,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 32 * 7 * 86400,
                    'download': size2Bytes('3000 GiB'),
                    'ratio': 9,
                    'privilege': ''
                },
            ]
        },
        "open.cd": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('20 GiB'),
                    'ratio': 1.5,
                    'privilege': '可以請求續種； 可以發送邀請； 可以查看排行榜；可以查看其它用戶的種子歷史(如果用戶隱私等級未設置為"強" )； 可以刪除自己上傳的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('60 GiB'),
                    'ratio': 2,
                    'privilege': '<span style="color:green">封存賬號後規定時間內不會被刪除</span>；發布三個種子後無需經過候選可直接發布種子'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('200 GiB'),
                    'ratio': 2.5,
                    'privilege': '可以在做種/下載/發布的時候選擇匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('400 GiB'),
                    'ratio': 3,
                    'privilege': '可以查看普通日誌'
                },
                {
                    'name': 'Veteran User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('600 GiB'),
                    'ratio': 3.5,
                    'privilege': '可以查看用戶列表；可以查看其它用戶的評論、帖子歷史；<span style="color:green">永遠保留賬號</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 4,
                    'privilege': '可以更新過期的外部信息'
                },
                {
                    'name': 'Ultimate User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4.5,
                    'privilege': '查看種子文件的結構'
                },
                {
                    'name': 'Kinghou Master',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 5,
                    'privilege': ''
                },
            ]
        },
        "lemonhd.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('100 GiB'),
                    'ratio': 2,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('350 GiB'),
                    'ratio': 2.5,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 3,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 4.5,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('6 TiB'),
                    'ratio': 5,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 52 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 5.5,
                    'privilege': ''
                },
            ]
        },
        "ptsbao.club": {
            ranks: [
                {
                    'name': '常在/Power User',
                    'time': 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': ''
                },
                {
                    'name': '贵人Elite User',
                    'time': 2 * 7 * 86400,
                    'download': size2Bytes('150 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号（在控制面板）后不会被删除帐号</span>'
                },
                {
                    'name': '嫔/Crazy User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': ''
                },
                {
                    'name': '贵嫔/Insane User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': ''
                },
                {
                    'name': '妃/Veteran User',
                    'time': 16 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': '贵妃/Extreme User',
                    'time': 24 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': ''
                },
                {
                    'name': '皇妃/Ultimate User',
                    'time': 36 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': '皇后/Nexus Master',
                    'time': 52 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "pt.btschool.club": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 2,
                    'privilege': '可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('100 GiB'),
                    'ratio': 2.5,
                    'privilege': '可以直接发布种子； 可以查看排行榜'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 3,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 3.5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 4,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4.5,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('5 TiB'),
                    'ratio': 5,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('10 TiB'),
                    'ratio': 5.5,
                    'privilege': '可以发送邀请'
                },
            ]
        },
        "pt.eastgame.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.5,
                    'privilege': '可以查看NFO文档；可以请求续种； 查看种子结构；可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看用户的种子历史记录，如下载种子的历史记录（只有用户的隐私等级没有设为’强‘时才生效）； 可以查看高级会员区 . Elite User +论坛'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看排行榜；可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 4.55,
                    'privilege': '可以发送邀请；查看一般日志，不能查看机密日志；<span style="color:green">封存账号后将永远保留</span>'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 5.05,
                    'privilege': '可以查看其它用户的评论、帖子历史(如果用户隐私等级未设置为"强")；<span style="color:green">账号永远保留</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 45 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 6.55,
                    'privilege': '可以更新过期的外部信息'
                },
                {
                    'name': 'Ultimate User',
                    'time': 50 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 7.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 55 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 8.55,
                    'privilege': ''
                },
            ]
        },
        "pthome.net": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('100 GiB'),
                    'ratio': 2,
                    'privilege': '可以查看NFO文档；可以查看用户列表；可以请求续种； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕；可以浏览论坛邀请专版'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('200 GiB'),
                    'ratio': 3,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('400 GiB'),
                    'ratio': 4,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('600 GiB'),
                    'ratio': 5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('1000 GiB'),
                    'ratio': 6,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1600 GiB'),
                    'ratio': 7,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('2200 GiB'),
                    'ratio': 8,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3000 GiB'),
                    'ratio': 9,
                    'privilege': ''
                },
            ]
        },
        "ourbits.club": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('100 GiB'),
                    'ratio': 2,
                    'privilege': '可以查看NFO文档；可以查看用户列表；可以请求续种； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕；最多可以同时下载20个种子'
                },
                {
                    'name': 'Elite User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('350 GiB'),
                    'ratio': 2.5,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>；此等级及以上没有下载数限制；可以查看论坛Elite User(邀请交流版)'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 3,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 4.5,
                    'privilege': '可以更新过期的外部信息'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('6 TiB'),
                    'ratio': 5,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 52 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 5.5,
                    'privilege': ''
                },
            ]
        },
        "hddolby.com": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 2 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 2,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('256 GiB'),
                    'ratio': 2.5,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('512 GiB'),
                    'ratio': 3,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 12 * 7 * 86400,
                    'download': size2Bytes('768 GiB'),
                    'ratio': 3.5,
                    'privilege': ''
                },
                {
                    'name': 'Veteran User',
                    'time': 16 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 4,
                    'privilege': '可以查看其它用户的评论、帖子历史'
                },
                {
                    'name': 'Extreme User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4.5,
                    'privilege': '<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Ultimate User',
                    'time': 24 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 5,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 48 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 5.5,
                    'privilege': ''
                },
            ]
        },
        "hdhome.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 2,
                    'privilege': ''
                },
                {
                    'name': 'Elite User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('220 GiB'),
                    'ratio': 2.5,
                    'privilege': ''
                },
                {
                    'name': 'Crazy User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('400 GiB'),
                    'ratio': 3,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('600 GiB'),
                    'ratio': 3.5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('900 GiB'),
                    'ratio': 4,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">封存账号（在控制面板）后不会被删除帐号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4.5,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 5,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 5.5,
                    'privilege': '<span style="color:green">账号永久保留</span>'
                },
            ]
        },
        "hdtime.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('150 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 3.05,
                    'privilege': '免除增量考核；可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'HDtime Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('10 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "nicept.net": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接發布種子；可以檢視NFO文件；可以檢視用戶清單；可以要求續種； 可以傳送邀請； 可以檢視排行榜；可以檢視其他用戶的種子曆史(如果用戶隱私等級未設定為"強")； 可以移除自己上傳的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存賬號后不會被移除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做種/下載/發布的時候選取匿名型態'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以檢視普通日誌'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以檢視其他用戶的評論、帖子曆史；<span style="color:green">永遠保留賬號</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新過期的外部資訊；可以檢視Extreme User論壇'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "pt.msg.vg": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "discfan.net": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接發布種子；可以檢視NFO文件；可以檢視用戶清單；可以要求續種； 可以傳送邀請； 可以檢視排行榜；可以檢視其他用戶的種子曆史(如果用戶隱私等級未設定為"強")； 可以移除自己上傳的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存賬號后不會被移除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做種/下載/發布的時候選取匿名型態'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以檢視普通日誌'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以檢視其他用戶的評論、帖子曆史；<span style="color:green">永遠保留賬號</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新過期的外部資訊；可以檢視Extreme User論壇'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "tjupt.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以发送邀请；可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "chdbits.co": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('200 GiB'),
                    'ratio': 2,
                    'bonus': '80000',
                    'privilege': '可以查看NFO文档；可以请求续种； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 3,
                    'bonus': '150000',
                    'privilege': ''
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('800 GiB'),
                    'ratio': 4,
                    'bonus': '300000',
                    'privilege': '可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕；可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('999 GiB'),
                    'ratio': 5,
                    'bonus': '650000',
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('1500 GiB'),
                    'ratio': 6,
                    'bonus': '1000000',
                    'privilege': '可以查看其它用户的评论、帖子历史'
                },
                {
                    'name': 'Extreme User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 7,
                    'bonus': '2200000',
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛；<span style="color:green">封存账号（在控制面板）后不会被删除帐号</span>'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 8,
                    'bonus': '3500000',
                    'privilege': '<span style="color:green">保留帐号</span>；在官方活动期间可发放邀请'
                },
                {
                    'name': 'Nexus Master',
                    'time': 52 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 10,
                    'bonus': '5000000',
                    'privilege': ''
                },
            ]
        },
        "pterclub.com": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看邀请区；可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以删除自己上传的字幕；可以上传字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 35 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看初级精英论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 45 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "hdsky.me": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('200 GiB'),
                    'ratio': 2,
                    'privilege': '可以查看NFO文档；可以请求续种；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.5,
                    'privilege': ''
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 3.5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 4,
                    'privilege': '<span style="color:green">用户封存账号后不会被删除</span>；除非站点设置，可以查看其它用户的评论、帖子历史'
                },
                {
                    'name': 'Extreme User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('6 TiB'),
                    'ratio': 4.5,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 45 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 5,
                    'privilege': '<span style="color:green">永远保留账号，但不等于不会被封禁</span>；免除站点定期进行的数据增量考核'
                },
                {
                    'name': 'Nexus Master',
                    'time': 65 * 7 * 86400,
                    'download': size2Bytes('10 TiB'),
                    'ratio': 5.5,
                    'privilege': '可以直接发布种子；可以查看排行榜；可以发送邀请，管理员设置的特殊情况除外'
                },
            ]
        },
        "pttime.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('512 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('1024 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('2048 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('4096 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 52 * 7 * 86400,
                    'download': size2Bytes('8192 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('16384 GiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 104 * 7 * 86400,
                    'download': size2Bytes('35000 GiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 130 * 7 * 86400,
                    'download': size2Bytes('70000 GiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "hdfans.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('128 GiB'),
                    'ratio': 1,
                    'privilege': '可以直接发布种子； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('256 GiB'),
                    'ratio': 1.5,
                    'privilege': ''
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('512 GiB'),
                    'ratio': 2,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('1024 GiB'),
                    'ratio': 2.5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('2048 GiB'),
                    'ratio': 3,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">封存账号（在控制面板）后不会被删除帐号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 3.5,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 4,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 52 * 7 * 86400,
                    'download': size2Bytes('10 TiB'),
                    'ratio': 5,
                    'privilege': ''
                },
            ]
        },
        "hdzone.me": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 2,
                    'privilege': ''
                },
                {
                    'name': 'Elite User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('220 GiB'),
                    'ratio': 2.5,
                    'privilege': ''
                },
                {
                    'name': 'Crazy User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('400 GiB'),
                    'ratio': 3,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('600 GiB'),
                    'ratio': 3.5,
                    'privilege': '可以查看普通日志；<span style="color:green">封存账号（在控制面板）后不会被删除帐号</span>'
                },
                {
                    'name': 'Veteran User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('900 GiB'),
                    'ratio': 4,
                    'privilege': '可以查看其它用户的评论、帖子历史'
                },
                {
                    'name': 'Extreme User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4.5,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 5,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 5.5,
                    'privilege': '<span style="color:green">账号永久保留</span>'
                },
            ]
        },
        "52pt.site": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以查看NFO文档；可以请求续种； 可以发送邀请；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 允许发布新的趣味盒内容及编辑自己发布的趣味盒内容；可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('1536 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('2560 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('3072 GiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('4608 GiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('5632 GiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "hdcity.city": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('50 GiB'),
                    'ratio': 1,
                    'privilege': '可以请求续种； 可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('150 GiB'),
                    'ratio': 1.1,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 12 * 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('500 GiB'),
                    'ratio': 1.5,
                    'privilege': '可以直接发布种子；可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 16 * 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('1 TiB'),
                    'ratio': 2,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 24 * 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('5 TiB'),
                    'ratio': 2.5,
                    'privilege': '<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 36 * 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('10 TiB'),
                    'ratio': 2.6,
                    'privilege': ''
                },
                {
                    'name': 'Ultimate User',
                    'time': 72 * 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('20 TiB'),
                    'ratio': 2.8,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('40 TiB'),
                    'ratio': 4,
                    'privilege': ''
                },
            ]
        },
        "et8.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 2 * 7 * 86400,
                    'download': size2Bytes('64 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以上传种子；可以删除自己上传的字幕；可以在做种/下载/上传的时候选择匿名模式'
                },
                {
                    'name': 'Elite User',
                    'time': 6 * 7 * 86400,
                    'download': size2Bytes('128 GiB'),
                    'ratio': 1.55,
                    'privilege': '购买邀请； 可以查看邀请论坛；可以查看NFO文档；可以更新外部信息；可以请求续种；可以使用个性条'
                },
                {
                    'name': 'Crazy User',
                    'time': 14 * 7 * 86400,
                    'download': size2Bytes('256 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")'
                },
                {
                    'name': 'Insane User',
                    'time': 26 * 7 * 86400,
                    'download': size2Bytes('512 GiB'),
                    'ratio': 2.55,
                    'privilege': '<span style="color:green">Park后不会被删除帐号</span>'
                },
                {
                    'name': 'Veteran User',
                    'time': 38 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.05,
                    'privilege': '可以发送邀请；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 54 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以查看种子文件结构'
                },
                {
                    'name': 'Ultimate User',
                    'time': 70 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 4.05,
                    'privilege': '可以查看其它用户的评论、帖子历史'
                },
                {
                    'name': 'Nexus Master',
                    'time': 88 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "pt.soulvoice.club": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "ccfbits.org": {
            ranks: [
                {
                    'name': '初级会员',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('0 GiB'),
                    'upload': size2Bytes('25 GiB'),
                    'ratio': 1.05,
                    'privilege': ''
                },
                {
                    'name': '中级会员',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'upload': size2Bytes('200 GiB'),
                    'ratio': 1.1,
                    'privilege': ''
                },
                {
                    'name': '高级会员',
                    'time': 12 * 7 * 86400,
                    'download': size2Bytes('100 GiB'),
                    'upload': size2Bytes('500 GiB'),
                    'ratio': 1.2,
                    'privilege': ''
                },
                {
                    'name': '超级会员',
                    'time': 24 * 7 * 86400,
                    'download': size2Bytes('200 GiB'),
                    'upload': size2Bytes('1 TiB'),
                    'ratio': 1.3,
                    'privilege': ''
                },
                {
                    'name': '支柱会员',
                    'time': 32 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'upload': size2Bytes('5 TiB'),
                    'ratio': 2,
                    'privilege': ''
                },
            ]
        },
        "hdchina.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('200 GiB'),
                    'ratio': 1.5,
                    'privilege': '可以使用道具；可以打开签名和个性化称号'
                },
                {
                    'name': 'Elite User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2,
                    'privilege': '可以在候选区投票；可以在论坛建议区发帖；可以上传字幕；可以删除自己上传的字幕'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 2.5,
                    'privilege': '可以查看排行榜；可以使用挂起功能；可在种子区观看到当前下载活动进度条；可以查看当前自己在全站中的流量排名；可以进入邀请区'
                },
                {
                    'name': 'Insane User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 3,
                    'privilege': '可以直接发布种子'
                },
                {
                    'name': 'Veteran User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4,
                    'privilege': '可以在个人资料内隐藏个人信息；可以匿名做种'
                },
                {
                    'name': 'Extreme User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 5,
                    'privilege': '可以发送邀请；可以查看其它会员种子历史；可以更新IMDb信息'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 6,
                    'privilege': '<span style="color:green">账号挂起永久保留</span>；未挂起的情况下可以保留50周；取消一个月只能发送一个邀请的限制'
                },
                {
                    'name': 'Nexus Master',
                    'time': 50 * 7 * 86400,
                    'download': size2Bytes('5 TiB'),
                    'ratio': 8,
                    'privilege': '<span style="color:green">账号永久保存(无需挂起)</span>'
                },
            ]
        },
        "joyhd.net": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.2,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('100 GiB'),
                    'ratio': 1.5,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>；可以发送邀请；可以请求续种'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('200 GiB'),
                    'ratio': 2.5,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('400 GiB'),
                    'ratio': 3.5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('600 GiB'),
                    'ratio': 4.5,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('1000 GiB'),
                    'ratio': 5.5,
                    'privilege': '可以更新过期的外部信息'
                },
                {
                    'name': 'Ultimate User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('2000 GiB'),
                    'ratio': 6,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 50 * 7 * 86400,
                    'download': size2Bytes('5000 GiB'),
                    'ratio': 6,
                    'privilege': ''
                },
            ]
        },
        "totheglory.im": {
            ranks: [
                {
                    'name': 'KiloByte',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('60 GiB'),
                    'ratio': 1.1,
                    'privilege': '可申请种子候选'
                },
                {
                    'name': 'MegaByte',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('150 GiB'),
                    'ratio': 2,
                    'privilege': ''
                },
                {
                    'name': 'GigaByte',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('250 GiB'),
                    'ratio': 2,
                    'privilege': '可挂起，可进入积分商城'
                },
                {
                    'name': 'TeraByte',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.5,
                    'privilege': '可用积分购买邀请，并可浏览全站（新加游戏分类页），可以访问邀请区'
                },
                {
                    'name': 'PetaByte',
                    'time': 16 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 2.5,
                    'privilege': '可直接发布种子'
                },
                {
                    'name': 'ExaByte',
                    'time': 24 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3,
                    'privilege': '<span style="color:green">自行挂起账号后不会被清除</span>'
                },
                {
                    'name': 'ZettaByte',
                    'time': 24 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 3.5,
                    'privilege': '免除流量考核'
                },
                {
                    'name': 'YottaByte',
                    'time': 24 * 7 * 86400,
                    'download': size2Bytes('2.5 TiB'),
                    'ratio': 4,
                    'privilege': '可查看排行榜'
                },
                {
                    'name': 'BrontoByte',
                    'time': 32 * 7 * 86400,
                    'download': size2Bytes('3.5 TiB'),
                    'ratio': 5,
                    'privilege': '<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'NonaByte',
                    'time': 48 * 7 * 86400,
                    'download': size2Bytes('5 TiB'),
                    'upload': size2Bytes('50 TiB'),
                    'ratio': 6,
                    'privilege': ''
                },
                {
                    'name': 'DoggaByte',
                    'time': 48 * 7 * 86400,
                    'download': size2Bytes('10 TiB'),
                    'upload': size2Bytes('100 TiB'),
                    'ratio': 6,
                    'privilege': ''
                },
            ]
        },
        "hdarea.co": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以请求续种； 可以发送邀请（开放邀请权限时）； 可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 3,
                    'privilege': ''
                },
                {
                    'name': 'Crazy User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 3.5,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 12 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 4,
                    'privilege': '可以查看普通日志；<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Veteran User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('1024 GiB'),
                    'ratio': 4.5,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 5,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('5 TiB'),
                    'ratio': 5.5,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('10 TiB'),
                    'ratio': 6,
                    'privilege': ''
                },
            ]
        },
        "u2.dmhy.org": {
            ranks: [
                {
                    'name': '御宅族',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '查看会员列表；请求补种； 查看普通日志； 使用流量信息条'
                },
                {
                    'name': '宅修士',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': ''
                },
                {
                    'name': '宅教士',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': ''
                },
                {
                    'name': '宅传教士',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': ''
                },
                {
                    'name': '宅护法',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '使用邀请名额； 无可用邀请时，购买邀请'
                },
                {
                    'name': '宅贤者',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1024 GiB'),
                    'ratio': 3.55,
                    'privilege': ''
                },
                {
                    'name': '宅圣',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1536 GiB'),
                    'ratio': 4.05,
                    'privilege': '<span style="color:green">账号封存后永久保留</span>'
                },
                {
                    'name': '宅神',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3072 GiB'),
                    'ratio': 4.55,
                    'privilege': '<span style="color:green">账号永久保留</span>'
                },
            ]
        },
        "pt.hdupt.com": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 2,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 2.5,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>；可以进入论坛邀请区'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 3,
                    'privilege': ''
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 3.85,
                    'privilege': ''
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 5.95,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 6.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 7.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 8.85,
                    'privilege': ''
                },
            ]
        },
        "yingk.com": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 3 * 7 * 86400,
                    'download': size2Bytes('5 GiB'),
                    'upload': size2Bytes('512 GiB'),
                    'ratio': 1.5,
                    'privilege': '可以查看NFO文档；可以查看用户列表；可以请求续种； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 6 * 7 * 86400,
                    'download': size2Bytes('10 GiB'),
                    'upload': size2Bytes('1 TiB'),
                    'ratio': 2,
                    'privilege': '可以直接发布种子'
                },
                {
                    'name': 'Crazy User',
                    'time': 12 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'upload': size2Bytes('5 TiB'),
                    'ratio': 3,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>；可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('80 GiB'),
                    'upload': size2Bytes('8 TiB'),
                    'ratio': 4,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('160 GiB'),
                    'upload': size2Bytes('16 TiB'),
                    'ratio': 5,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('320 GiB'),
                    'upload': size2Bytes('32 TiB'),
                    'ratio': 6,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('640 GiB'),
                    'upload': size2Bytes('64 TiB'),
                    'ratio': 7,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 52 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'upload': size2Bytes('128 TiB'),
                    'ratio': 8,
                    'privilege': ''
                },
            ]
        },
        "pt.keepfrds.com": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1,
                    'privilege': '可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以查看 IMDB/Douban 信息；可以使用魔力值'
                },
                {
                    'name': 'Elite User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('150 GiB'),
                    'ratio': 1.5,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>；可以查看排行榜；IMDB/Douban Top 榜单；论坛的邀请区'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2,
                    'privilege': '可以在做种/下载的时候选择匿名模式；可以使用自动合集功能'
                },
                {
                    'name': 'Insane User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.5,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>，并且在上传下载时有更大的概率被 Tracker 返回 peer'
                },
                {
                    'name': 'Extreme User',
                    'time': 90 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4,
                    'privilege': '超速后不会受到额外惩罚，上传量按照等级对应的限速计算，但是仍然会无视种子优惠计算100%的下载量；可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 120 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.5,
                    'privilege': '上传速度限制提升为普通用户的二倍（200Mbps/25MB/s）；可以访问 Keepfrds Beta'
                },
                {
                    'name': 'Nexus Master',
                    'time': 150 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 5,
                    'privilege': '没有上传速度的限制'
                },
            ]
        },
        "hdatmos.club": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "avgv.cc": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接發布種子；可以檢視NFO文件；可以檢視用戶清單；可以要求續種； 可以傳送邀請； 可以檢視排行榜；可以檢視其他用戶的種子曆史(如果用戶隱私等級未設定為"強")； 可以移除自己上傳的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存賬號后不會被移除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做種/下載/發布的時候選取匿名型態'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以檢視普通日誌'
                },
                {
                    'name': 'Veteran User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('900 GiB'),
                    'ratio': 4,
                    'privilege': '可以檢視其他用戶的評論、帖子曆史；<span style="color:green">永遠保留賬號</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4.55,
                    'privilege': '可以更新過期的外部資訊；可以檢視Extreme User論壇'
                },
                {
                    'name': 'Ultimate User',
                    'time': 50 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 5,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 5.5,
                    'privilege': ''
                },
            ]
        },
        "oshen.win": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "dragonhd.xyz": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "htpt.cc": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': ''
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': ''
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': ''
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "hd.ai": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "pt.hd4fans.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "nanyangpt.com": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 2 * 7 * 86400,
                    'download': size2Bytes('30 GiB'),
                    'ratio': 1.5,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 5 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 2.5,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 10 * 7 * 86400,
                    'download': size2Bytes('100 GiB'),
                    'ratio': 3.5,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式；可以在邀请传送门版块发帖'
                },
                {
                    'name': 'Insane User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 4.5,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 20 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 5.5,
                    'privilege': '可以查看排行榜；可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 30 * 7 * 86400,
                    'download': size2Bytes('700 GiB'),
                    'ratio': 6.5,
                    'privilege': '可以更新过期的外部信息；可以查看晋升副教论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('900 GiB'),
                    'ratio': 7.5,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 50 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 8.5,
                    'privilege': ''
                },
            ]
        },
        "pt.sjtu.edu.cn": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以查看NFO文档；可以查看用户列表；可以请求续种；可以在求种补种区发主题帖；可以查看友站邀请专区；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")；可以在魔力值系统购买更多邀请名额；可以同时下载5个种子'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">Park后不会被删除账号</span>；可以直接上传种子；可以同时下载8个种子'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以发送邀请；可以在做种/下载/发布的时候选择匿名模式；可以同时下载10个种子'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志；可以下载种子线程无限制'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': '可以查看种子文件结构'
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "pt.hdbd.us": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('100 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种；可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('200 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 12 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 26 * 7 * 86400,
                    'download': size2Bytes('1500 GiB'),
                    'ratio': 3,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 48 * 7 * 86400,
                    'download': size2Bytes('3000 GiB'),
                    'ratio': 4,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 96 * 7 * 86400,
                    'download': size2Bytes('6 TiB'),
                    'ratio': 6,
                    'privilege': '可以更新过期的外部信息'
                },
                {
                    'name': 'Ultimate User',
                    'time': 130 * 7 * 86400,
                    'download': size2Bytes('10 TiB'),
                    'ratio': 8,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 182 * 7 * 86400,
                    'download': size2Bytes('30 TiB'),
                    'ratio': 16,
                    'privilege': ''
                },
            ]
        },
        "hd-torrents.org": {
            ranks: [
                {
                    'name': 'HD Maniac',
                    'time': 0,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': 'access to "Top 10"'
                },
                {
                    'name': 'HD Monster',
                    'time': 0,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('250 GiB'),
                    'ratio': 2,
                    'privilege': 'access to "Tracker Info","Invites" section of the forums'
                },
                {
                    'name': 'HD Daemon',
                    'time': 0,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('1 TiB'),
                    'ratio': 4,
                    'privilege': 'access to "Users"'
                },
            ]
        },
        "filelist.io": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('20 GiB'),
                    'ratio': 1.05,
                    'privilege': 'Poate downloada fișiere de tip DOX, mai mari de 1MB.Această clasă are dreptul de a aplica pentru statutul de uploader.'
                },
                {
                    'name': 'Addict',
                    'time': 26 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('500 GiB'),
                    'ratio': 4,
                    'privilege': 'Această clasă are dreptul să facă request pentru Custom Title. Această clasă are dreptul să facă request-uri.'
                },
                {
                    'name': 'Elite',
                    'time': 4 * 365 * 86400,
                    'download': 0,
                    'upload': size2Bytes('4 TiB'),
                    'ratio': 5,
                    'privilege': 'Această clasă îţi oferă dreptul de a acorda reputaţie altor useri.'
                },
            ]
        },
        "empornium.me": {
            ranks: [
                {
                    'name': 'Perv',
                    'time': 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('10 GiB'),
                    'ratio': 0.6,
                    'privilege': 'can access top10 lists；can add and vote on tags；can use upload templates；can set forum signature (up to 128 characters)'
                },
                {
                    'name': 'Good Perv',
                    'time': 4 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('25 GiB'),
                    'ratio': 1.05,
                    'privilege': 'can access site statistics；can create public upload templates；can create and vote in requests；can use the notifications system；can create collages；can add multiple tags at once；can see uploaders name in upload (unless forced hidden)；can download zips of torrent files (from collages, and user pages)；can play Slot Machine；can create polls in the forums； can bump threads in the forums；can access the Serious Discussion forum；can set forum signature (up to 256 characters)'
                },
                {
                    'name': 'Great Perv',
                    'time': 8 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('100 GiB'),
                    'ratio': 1.05,
                    'privilege': '<span style="color:red">上传5个种子</span>；can access the Invite forum；can set forum signature (up to 512 characters)'
                },
                {
                    'name': 'Sextreme Perv',
                    'time': 13 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('1 TiB'),
                    'ratio': 1.05,
                    'privilege': '<span style="color:red">上传50个种子</span>；can set forum signature (up to 1024 characters)'
                },
                {
                    'name': 'Smut Peddler',
                    'time': 26 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('10 TiB'),
                    'ratio': 1.05,
                    'privilege': '<span style="color:red">上传250个种子</span>；can set forum signature (up to 2048 characters)'
                },
            ]
        },
        "exoticaz.to": {
            ranks: [
                {
                    'name': 'Member',
                    'time': 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('5 GiB'),
                    'ratio': 1,
                    'privilege': 'Can download 50 torrents a day；Can upload'
                }
            ]
        },
        "hd-space.org": {
            ranks: [
                {
                    'name': 'HD Spacer',
                    'time': 0,
                    'download': 0,
                    'upload': size2Bytes('100 GiB'),
                    'ratio': 1.05,
                    'privilege': 'Have access to BlackJack, Expected, Catalog, Games pages'
                },
                {
                    'name': 'HD Astronaut',
                    'time': 0,
                    'download': 0,
                    'upload': size2Bytes('500 GiB'),
                    'ratio': 2.25,
                    'privilege': 'Have access to HD Spacer extras and Top 10, Members, Requests, Episode pages'
                },
                {
                    'name': 'HD Alien',
                    'time': 0,
                    'download': 0,
                    'upload': size2Bytes('2 TiB'),
                    'ratio': 4.25,
                    'privilege': ''
                }
            ]
        },
        "jpopsuki.eu": {
            ranks: [
                {
                    'name': 'Member',
                    'time': 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('10 GiB'),
                    'ratio': 0.7,
                    'privilege': 'Can use invites, notifications, set a forum signature, access the Top 10 and edit the Knowledge base'
                },
                {
                    'name': 'Power User',
                    'time': 2 * 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'upload': size2Bytes('25 GiB'),
                    'ratio': 1.05,
                    'privilege': '<span style="color:red">上传5个种子</span>；advanced Top 10, can view torrent snatched list, delete tags, edit torrent\'s description, original title and release date and access the advanced user search. Receives a new invite once per month (up to a maximum of 10 available invites)'
                }
            ]
        },
        "torrentleech.org": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 2 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('200 GiB'),
                    'ratio': 1.1,
                    'privilege': 'Increased Points:3%；Minimum Seeding Time: 8 days'
                },
                {
                    'name': 'Super User',
                    'time': 12 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('1 TiB'),
                    'ratio': 2,
                    'privilege': 'Increased Points:5%；Minimum Seeding Time: 7 days'
                },
                {
                    'name': 'Extreme User',
                    'time': 24 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('10 TiB'),
                    'ratio': 5,
                    'privilege': 'Increased Points:6%；Minimum Seeding Time: 6 days'
                },
                {
                    'name': 'TL GOD',
                    'time': 52 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('50 TiB'),
                    'ratio': 8,
                    'privilege': 'Increased Points:8%；Minimum Seeding Time: 4 days'
                },
            ]
        },
        "redacted.ch": {
            ranks: [
                {
                    'name': 'Member',
                    'time': 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('10 GiB'),
                    'ratio': 0.65,
                    'privilege': 'Can edit collages'
                },
                {
                    'name': 'Power User',
                    'time': 2 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('25 GiB'),
                    'ratio': 0.65,
                    'privilege': '<span style="color:red">上传5个种子</span>；can access notifications and collage subscriptions, create new collages, get a personal collage, access to the Power User & Invites forums, can create forum polls, use the artist and personal Collector features, can access profile page stat graphs, and immunity from inactivity disabling'
                },
                {
                    'name': 'Elite',
                    'time': 4 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('100 GiB'),
                    'ratio': 0.65,
                    'privilege': '<span style="color:red">上传50个种子</span>；Access to the Elite forum, Top 10 filters, a second personal collage, profile album, and torrent editing privileges'
                },
                {
                    'name': 'Torrent Master',
                    'time': 8 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('500 GiB'),
                    'ratio': 0.65,
                    'privilege': '<span style="color:red">上传500个种子</span>；Access to the Torrent Master forum, earns custom title, a third personal collage, the ability to omit their username from personal collage names, and unlimited invites'
                },
                {
                    'name': 'Power TM',
                    'time': 8 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('500 GiB'),
                    'ratio': 0.65,
                    'privilege': '<span style="color:red">上传500个种子</span>；Everything Torrent Master gets plus a fourth personal collage'
                },
                {
                    'name': 'Elite TM',
                    'time': 8 * 7 * 86400,
                    'download': 0,
                    'upload': size2Bytes('500 GiB'),
                    'ratio': 0.65,
                    'privilege': '<span style="color:red">上传500个种子</span>；Everything Power TM gets plus a fifth personal collage'
                },
            ]
        },
        "uhdbits.org": {
            ranks: [
                {
                    'name': 'User',
                    'time': 7 * 86400,
                    'download': size2Bytes('1 KiB'),
                    'ratio': 0.7,
                    'privilege': 'Access to Top 10；Can create and edit Wiki pages'
                },
                {
                    'name': 'Power',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('100 GiB'),
                    'ratio': 1.5,
                    'privilege': '<span style="color:red">Snatch:50 Seed/Leech ratio: 10</span>；Access to the Invite Forum；Ability to Upload；Ability to make New Requests；Enable Users online and Users on IRC on front page；Access to full Staff page'
                },
                {
                    'name': 'Extreme',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2,
                    'privilege': '<span style="color:red">Snatch:60 Seed/Leech ratio: 20</span>；'
                },
                {
                    'name': 'Elite',
                    'time': 16 * 7 * 86400,
                    'download': size2Bytes('900 GiB'),
                    'ratio': 2.5,
                    'privilege': '<span style="color:red">Snatch:180 Seed/Leech ratio: 30</span>；'
                },
                {
                    'name': 'Guru',
                    'time': 32 * 7 * 86400,
                    'download': size2Bytes('2700 GiB'),
                    'ratio': 3,
                    'privilege': '<span style="color:red">Snatch:540 Seed/Leech ratio: 40</span>；'
                },
                {
                    'name': 'Master',
                    'time': 64 * 7 * 86400,
                    'download': size2Bytes('8100 GiB'),
                    'ratio': 3.5,
                    'privilege': '<span style="color:red">Snatch:1620 Seed/Leech ratio: 50</span>；'
                },
            ]
        },
        "springsunday.net": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 0,
                    'download': size2Bytes('100 GiB'),
                    'ratio': 1.1,
                    'bonus2': 20000,
                    'privilege': '可以查看NFO文档；可以请求续种；可以上传字幕或删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 0,
                    'download': size2Bytes('200 GiB'),
                    'ratio': 1.2,
                    'bonus2': 50000,
                    'privilege': '可以查看用户列表；可以查看排行榜'
                },
                {
                    'name': 'Crazy User',
                    'time': 0,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 1.2,
                    'bonus2': 100000,
                    'privilege': '可以直接发布种子；可以更新过期的外部信息；可以在做种/下载/发布的时候选择匿名模式；可以浏览论坛邀请区；<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Insane User',
                    'time': 0,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 1.2,
                    'bonus2': 200000,
                    'privilege': '可以查看其它用户的种子历史（如果用户隐私等级未设置为“强”）'
                },
                {
                    'name': 'Veteran User',
                    'time': 0,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 1.2,
                    'bonus2': 400000,
                    'privilege': '<span style="color:green">永远保留账号</span>；免除站点常规考核'
                },
                {
                    'name': 'Extreme User',
                    'time': 0,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 1.5,
                    'bonus2': 600000,
                    'privilege': ''
                },
                {
                    'name': 'Ultimate User',
                    'time': 0,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 1.5,
                    'bonus2': 800000,
                    'privilege': '可以查看其它用户的评论、帖子历史'
                },
                {
                    'name': 'Nexus Master',
                    'time': 0,
                    'download': size2Bytes('5 TiB'),
                    'ratio': 1.5,
                    'bonus2': 1000000,
                    'privilege': ''
                },
                {
                    'name': 'Nexus God',
                    'time': 0,
                    'download': size2Bytes('10 TiB'),
                    'ratio': 2,
                    'upload': size2Bytes('100 TiB'),
                    'bonus2': 2000000,
                    'privilege': '彩色ID特权；可以查看普通日志；可以购买及发送邀请'
                },
            ]
        },
        "gazellegames.net": {
            ranks: [
                {
                    'name': 'Gamer',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus3': 600,
                    'privilege': 'Can send invites (these can be gained through contests or bought from the Shop)；Your inviter will receive 100 gold for your promotion；Ability to Download all the torrents from a torrent group；Ability to make requests；Ability to create Collections and Add to Collections；Ability to view Top 10；Ability to create Forum Polls；Ability to View Peerlists；Access to the Gamer forums；Can create new Forum Games；Can create threads in Suggestions / Ideas Forum'
                },
                {
                    'name': 'Pro Gamer',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus3': 1200,
                    'privilege': 'One (1) invite at promotion (up to a max of 2)；Your inviter will receive 500 gold for your promotion；Ability to Edit Torrents after 15 minute cutoff time (just release portion)；Ability to add external links；Ability to view Top10 torrents by tag；Access to item trading with other Pro Gamer+ users and #Trading in IRC；<span style="color:green">Access to the Pro Gamers forum and Invites forum (your account must be 1 month old for invite forum access)</span>；Access to #Casino in IRC；Access to Clans System (joining the clan, participating in Clan Wars)；Immunity from inactivity pruning'
                },
                {
                    'name': 'Elite Gamer',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus3': 2100,
                    'privilege': 'Two (2) invites at promotion (up to a max of 2)；Your inviter will receive 1,000 gold for your promotion；Ability to Edit Any Group, Torrent, or Collection Description；Ability to add internal links；Ability to Delete Tags；Ability to View anonymized Download and Snatchlists；Ability to edit custom title fully in profile (Allowed Tags) - bbcode allowed；Can Double Post in forums；Access to the #TeamGGn IRC channel；Can create Contests in the Contests forum；Can build items for staff approval；Immunity from Hit & Runs'
                },
                {
                    'name': 'Legendary Gamer',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus3': 3000,
                    'privilege': 'Zero (0) invites at promotion but 2 a month (up to a maximum of 2)；Your inviter will receive 5,000 gold for your promotion；Can have greater than 5000 Results in Searches；<span style="color:green">Access to the Legendary Gamer forum</span>；Access to the full site log；Access to site statistics；Access to the Legendary Gamer Invites forum (your account must be 3 months old for access)；Access to the #Brainstorming IRC channel'
                },
                {
                    'name': 'Master Gamer',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus3': 4200,
                    'privilege': 'Zero (0) invites at promotion but 2 invites a month (up to a maximum of 4)；Your inviter will receive 10,000 gold for your promotion；Ability to Delete & Recover Collections；Ability to Send Re-seed Requests regardless of time last seeded or last request；Ability to Add Torrent Recommendations；Access to the special forums；Access to item statistics；Access to #Master-Log in irc'
                },
                {
                    'name': 'Gaming God',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus3': 6000,
                    'privilege': 'Can send Unlimited Invites；Your inviter will receive 25,000 gold for your promotion；Can send Invites even when Closed；Can add posts to site Blog；Access to Torrent Bump tool；Automatic voice (+v) on #GazelleGames'
                },
            ]
        },
        "skyey2.com": {
            ranks: [
                {
                    'name': '白露',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus': 1000,
                    'privilege': '阅读权限:10；自定义头衔；允许设置回帖奖励；允许参与点评'
                },
                {
                    'name': '秋分',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus': 3000,
                    'privilege': '阅读权限:20'
                },
                {
                    'name': '霜降',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus': 5000,
                    'privilege': '阅读权限:30'
                },
                {
                    'name': '小雪',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus': 10000,
                    'privilege': '阅读权限:40'
                },
                {
                    'name': '大雪',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus': 30000,
                    'privilege': '阅读权限:50'
                },
                {
                    'name': '小寒',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus': 100000,
                    'privilege': '阅读权限:60'
                },
                {
                    'name': '大寒',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus': 300000,
                    'privilege': '阅读权限:70'
                },
                {
                    'name': '立春',
                    'time': 0,
                    'download': 0,
                    'ratio': 0,
                    'bonus': 1000000,
                    'privilege': '阅读权限:80'
                },
            ]
        },
        "1ptba.com": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.05,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('120 GiB'),
                    'ratio': 1.55,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 15 * 7 * 86400,
                    'download': size2Bytes('300 GiB'),
                    'ratio': 2.05,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 25 * 7 * 86400,
                    'download': size2Bytes('500 GiB'),
                    'ratio': 2.55,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('750 GiB'),
                    'ratio': 3.05,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 60 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.55,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 80 * 7 * 86400,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 4.05,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 100 * 7 * 86400,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.55,
                    'privilege': ''
                },
            ]
        },
        "wintersakura.net": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 0,
                    'download': size2Bytes('50 GiB'),
                    'ratio': 1.00,
                    'bonus2': 50000,
                    'privilege': '可以查看NFO文档；可以请求续种； 可以购买/发送邀请；可以删除自己上传的字幕。可以申请友情链接；可以使用个性条。'
                },
                {
                    'name': 'Elite User',
                    'time': 0,
                    'download': size2Bytes('400 GiB'),
                    'ratio': 1.50,
                    'bonus2': 120000,
                    'privilege': '可以查看种子结构；可以更新外部信息',
                },
                {
                    'name': 'Crazy User',
                    'time': 0,
                    'download': size2Bytes('800 GiB'),
                    'ratio': 2.00,
                    'bonus2': 200000,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式。'
                },
                {
                    'name': 'Insane User',
                    'time': 0,
                    'download': size2Bytes('1.5 TiB'),
                    'ratio': 3.00,
                    'bonus2': 500000,
                    'privilege': '可以查看排行榜。'
                },
                {
                    'name': 'Veteran User',
                    'time': 0,
                    'download': size2Bytes('3 TiB'),
                    'ratio': 4.00,
                    'bonus2': 800000,
                    'privilege': '可以查看其它用户种子历史。（只有用户的隐私等级没有设为‘强’时才生效）'
                },
                {
                    'name': 'Extreme User',
                    'time': 0,
                    'download': size2Bytes('5 TiB'),
                    'ratio': 6.00,
                    'bonus2': 1400000,
                    'privilege': '可以更新过期的外部信息。<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Ultimate User',
                    'time': 0,
                    'download': size2Bytes('6 TiB'),
                    'ratio': 8.00,
                    'bonus2': 2000000,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 0,
                    'download': size2Bytes('10 TiB'),
                    'ratio': 9.50,
                    'bonus2': 2800000,
                    'privilege': '<span style="color:green">永远保留账号</span>'
                },
            ]
        },
        "hdvideo.one": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('128 GiB'),
                    'ratio': 2.00,
                    'bonus2': 60480,
                    'privilege': '可以直接发布种子；可以查看NFO文档；可以查看用户列表；可以请求续种； 可以发送邀请； 可以查看排行榜；可以查看其它用户的种子历史(如果用户隐私等级未设置为"强")； 可以删除自己上传的字幕。'
                },
                {
                    'name': 'Elite User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('256 GiB'),
                    'ratio': 2.50,
                    'bonus2': 127680,
                    'privilege': '<span style="color:green">封存账号后不会被删除</span>'
                },
                {
                    'name': 'Crazy User',
                    'time': 12 * 7 * 86400,
                    'download': size2Bytes('512 GiB'),
                    'ratio': 3.00,
                    'bonus2': 191520,
                    'privilege': '可以在做种/下载/发布的时候选择匿名模式'
                },
                {
                    'name': 'Insane User',
                    'time': 18 * 7 * 86400,
                    'download': size2Bytes('1 TiB'),
                    'ratio': 3.50,
                    'bonus2': 317520,
                    'privilege': '可以查看普通日志'
                },
                {
                    'name': 'Veteran User',
                    'time': 24 * 7 * 86400,
                    'download': size2Bytes('2 TiB'),
                    'ratio': 4.00,
                    'bonus2': 423360,
                    'privilege': '可以查看其它用户的评论、帖子历史；<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 32 * 7 * 86400,
                    'download': size2Bytes('4 TiB'),
                    'ratio': 4.50,
                    'bonus2': 575232,
                    'privilege': '可以更新过期的外部信息；可以查看Extreme User论坛'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('6 TiB'),
                    'ratio': 5.00,
                    'bonus2': 719040,
                    'privilege': ''
                },
                {
                    'name': 'Nexus Master',
                    'time': 52 * 7 * 86400,
                    'download': size2Bytes('8 TiB'),
                    'ratio': 5.50,
                    'bonus2': 934752,
                    'privilege': ''
                },
            ]
        },
        "haidan.video": {
            ranks: [
                {
                    'name': 'Power User',
                    'time': 2 * 7 * 86400,
                    'download': size2Bytes('0 GiB'),
                    'ratio': 1.00,
                    'bonus4': 100,
                    'privilege': '允许购买邀请码，可以直接发布种子，可以删除自己上传的字幕。'
                },
                {
                    'name': 'Elite User',
                    'time': 4 * 7 * 86400,
                    'download': size2Bytes('0 GiB'),
                    'ratio': 1.00,
                    'bonus4': 200,
                    'privilege': '允许发送邀请码'
                },
                {
                    'name': 'Crazy User',
                    'time': 8 * 7 * 86400,
                    'download': size2Bytes('0 GiB'),
                    'ratio': 1.00,
                    'bonus4': 500,
                    'privilege': '查看种子结构'
                },
                {
                    'name': 'Insane User',
                    'time': 16 * 7 * 86400,
                    'download': size2Bytes('0 GiB'),
                    'ratio': 1.00,
                    'bonus4': 1000,
                    'privilege': '发布趣味盒'
                },
                {
                    'name': 'Veteran User',
                    'time': 28 * 7 * 86400,
                    'download': size2Bytes('0 GiB'),
                    'ratio': 1.00,
                    'bonus4': 2000,
                    'privilege': '<span style="color:green">永远保留账号</span>'
                },
                {
                    'name': 'Extreme User',
                    'time': 32 * 7 * 86400,
                    'download': size2Bytes('0 GiB'),
                    'ratio': 1.00,
                    'bonus4': 5000,
                    'privilege': '查看日志权限'
                },
                {
                    'name': 'Ultimate User',
                    'time': 40 * 7 * 86400,
                    'download': size2Bytes('0 GiB'),
                    'ratio': 1.00,
                    'bonus4': 8000,
                    'privilege': '查看排行榜'
                },
                {
                    'name': 'Nexus Master',
                    'time': 52 * 7 * 86400,
                    'download': size2Bytes('0 GiB'),
                    'ratio': 1.00,
                    'bonus4': 10000,
                    'privilege': '允许匿名，拥有发布主题推荐权限'
                },
            ]
        }
    };
}
