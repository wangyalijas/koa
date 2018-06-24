const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const querystring = require('querystring');

const Appid = "5b2b647f";
const ApiKey = "1f72d02abcb691af5b8a037dcf6c7120";

parseAudio = async (filePath, endCallback, errorCallback) => {
    var timestamp = Date.parse(new Date());
    var curTime = timestamp / 1000;
    var xParam = { "auf": "16k", "aue": "raw", "scene": "main", "userid": Appid }
    xParam = JSON.stringify(xParam);
    var xParamBase64 = new Buffer(xParam).toString('base64');

    //音频文件
    var fileData = fs.readFileSync(filePath);
    var fileBase64 = new Buffer(fileData).toString('base64');
    var bodyData = "data=" + fileBase64;

    var token = ApiKey + curTime + xParamBase64;
    const hash = crypto.createHash('md5');
    hash.update(token);
    var xCheckSum = hash.digest('hex');
    var options = {
        protocol: 'http:',
        port: 80,
        host: 'api.xfyun.cn',
        path: '/v1/service/v1/iat',
        method: 'POST',
        headers: {
            "X-Appid": Appid,
            "X-CurTime": curTime,
            "X-Param": xParamBase64,
            "X-CheckSum": xCheckSum,
            "userid": Appid,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    //#endregion
    var data = [];
    var req = http.request(options, function (res) {
        res.setEncoding('utf-8');
        data = [];
        res.on('data', function (result) {
            data.push(result);
        });
        res.on('end', function () {
            endCallback(data);
        });
    });
    req.on('error', errorCallback);
    req.write(querystring.stringify({
        'audio' : fileBase64
    }));
    req.end();
};

module.exports = parseAudio;
