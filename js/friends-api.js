function qexo_friend_api(id, url, reCaptcha = '') {
    qexo_url = url;
    Qexo_reCaptcha_Key = reCaptcha
    var loadStyle = '<div class="qexo_loading"><div class="qexo_part"><div style="display: flex; justify-content: center"><div class="qexo_loader"><div class="qexo_inner one"></div><div class="qexo_inner two"></div><div class="qexo_inner three"></div></div></div></div><p style="text-align: center; display: block">友链申请加载中...</p></div>';
    document.getElementById(id).className = "friend-api";
    document.getElementById(id).innerHTML = loadStyle;
    document.getElementById(id).innerHTML = '<center><p>请正确填写友链，然后点击申请等待核实，请先添加本站友链</p><div class="friend-api"><style>input.qexo-friend-input {flex: 1 1 0%;display: block;width: 100%;height: calc(1.5em + 1.25rem + 2px);padding: 0.625rem 0.75rem;font-weight: 400;color: #8898aa;box-shadow: 0 3px 2px rgb(233 236 239 / 5%);transition: all 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55);overflow: visible;margin: 0;font-family: inherit;font-size: inherit;line-height: inherit;position: relative;display: flex;flex-direction: column;min-width: 0;word-wrap: break-word;background-color: #fff;background-clip: border-box;border: 1px solid rgba(0, 0, 0, 0.05);border-radius: 0.375rem;black;}button.qexo-friend-button {cursor: pointer;position: relative;text-transform: none;transition: all 0.15s ease;letter-spacing: 0.025em;font-size: 0.875rem;will-change: transform;color: #fff;background-color: #5e72e4;border-color: #5e72e4;box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);vertical-align: middle;cursor: pointer;user-select: none;border: 1px solid transparent;padding: 0.625rem 1.25rem;font-size: 0.875rem;line-height: 1.5;border-radius: 0.25rem;transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;}</style><input type="text" id="qexo_friend_name" class="qexo-friend-input" placeholder="网站名"><br><input type="text" id="qexo_friend_brief introduction" class="qexo-friend-input" placeholder="网站简介"><br><input type="text" id="qexo_friend_website" class="qexo-friend-input"  placeholder="网址"><br><input type="text" id="qexo_friend_logo" class="qexo-friend-input" placeholder="头像"><br><button type="button" class="qexo-friend-button" id="qexo-friend-btn" onclick="friend_api()">申请</button></div></center><br>';
}

function friend_api() {

    document.getElementById('qexo-friend-btn').style.color = '#000';
    document.getElementById('qexo-friend-btn').style.backgroundColor = '#fff';
    document.getElementById('qexo-friend-btn').innerHTML = '…';

    let ask = function (token = '') {
        var name = document.getElementById('qexo_friend_name').value;
        var introduction = document.getElementById('qexo_friend_brief introduction').value;
        var website = document.getElementById('qexo_friend_website').value;
        var logo = document.getElementById('qexo_friend_logo').value;
        var uri = qexo_url + '/pub/ask_friend/';
        if (!name || !website || !logo) {
            document.getElementById('qexo-friend-btn').style.backgroundColor = '#f5365c';
            document.getElementById('qexo-friend-btn').innerHTML = "请先填写内容";
            return 0;
        }
        if (!/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(website) || !/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(logo)) {
            document.getElementById('qexo-friend-btn').style.backgroundColor = '#f5365c';
            document.getElementById('qexo-friend-btn').innerHTML = "请填写正确的网址";
            return 0;
        }
        let body = {
            name: name, url: website, image: logo, description: introduction
        }
        if (token) {
            body["verify"] = token;
        }
        data = ''
        for (i in body) {
            data += `&${i}=${encodeURIComponent(body[i])}`
        }
        data = data.slice(1)
        fetch(uri, {
            method: 'post', body: data, headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (data) {
            if (data.ok) {
                data.json().then(function (res) {
                    document.getElementById('qexo-friend-btn').style.color = '#fff';
                    if (res["status"]) {
                        document.getElementById('qexo-friend-btn').style.backgroundColor = '#2dce89';
                        document.getElementById('qexo-friend-btn').innerHTML = '提交成功！请等待确认！';
                    } else {
                        document.getElementById('qexo-friend-btn').style.backgroundColor = '#f5365c';
                        document.getElementById('qexo-friend-btn').innerHTML = "友链申请失败 提示：" + res["msg"];
                    }
                });
            } else {
                document.getElementById('qexo-friend-btn').style.color = '#fff';
                document.getElementById('qexo-friend-btn').style.backgroundColor = '#f5365c';
                document.getElementById('qexo-friend-btn').innerHTML = "网络异常！";
            }
        });
    }
    if (Qexo_reCaptcha_Key) {
        grecaptcha.ready(function () {
            grecaptcha.execute(reCaptcha, {action: 'submit'}).then(function (token) {
                ask(token)
            });
        });
    } else {
        ask()
    }
}
