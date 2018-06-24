const parseAudio = require('./parseAudio');

parseAudio(
    './uploads/tmp_9ed3194364ae005a67f4d730fe0c091f.wav',
    function (data) {
        //  接收讯飞回调
        var result = JSON.parse(data.join(''));
        if (result.code == "00000") {
            console.log(JSON.stringify(result.data))
            // httpRes.end();
        } else {
            console.log("讯飞接口识别录音错误" + result.code);
            console.log(JSON.stringify(result))
            // httpRes.end(result.desc);
        }
    },
    function (err) {
        console.log("发送到讯飞语音接口失败");
        console.error(err);
    }
);