const Koa = require('koa');
const fs = require("fs");
const Router = require('koa-router')();
const app = new Koa();
const multer = require('koa-multer');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const multiparty = require('multiparty');

const crypto = require('crypto');

const Appid = "5b2b647f";
const ApiKey = "1f72d02abcb691af5b8a037dcf6c7120";

Router.post('/audio', ctx => {
  const form = new multiparty.Form({
    encoding: 'utf8',
    maxFilesSize: 1 * 1024 * 1024,
    autoFiles: true,
    uploadDir: '/tmp'
  })
  form.parse(ctx.req, function (err, fields, files) {
    let file = files.audio[0];
    var newPath = "uploads/" + file.originalFilename.slice(0, file.originalFilename.indexOf(".")) + ".wav";
    ffmpeg(file.path)
      .format('wav')
      .on('error', function (err) {
        console.log('转换格式失败')
      })
      .on('end', function () {
        console.log('转换格式成功')
        xf_recogn(newPath, res);
      })
      .save(newPath)
  });

});

let xf_recogn = function (filePath, httpRes) {
  httpRes = 1;
}
// let xf_recogn = function (filePath, httpRes) {
//
//   var timestamp = Date.parse(new Date());
//   var curTime = timestamp / 1000;
//
//   var xParam = {"auf": "16k", "aue": "raw", "scene": "main", "userid": Appid}
//   xParam = JSON.stringify(xParam);
//   var xParamBase64 = new Buffer(xParam).toString('base64');
//
//
//   var fileData = fs.readFileSync(filePath);
//   var fileBase64 = new Buffer(fileData).toString('base64');
//   var bodyData = "data=" + fileBase64;
//
//   var token = ApiKey + curTime + xParamBase64 + bodyData;
//   const hash = crypto.createHash('md5');
//   hash.update(token);
//   var xCheckSum = hash.digest('hex');
//
//   var options = {
//     port: 80,
//     path: 'http://api.xfyun.cn/v1/service/v1/iat',
//     method: 'POST',
//     headers: {
//       "X-Appid": Appid,
//       "X-CurTime": curTime,
//       "X-Param": xParamBase64,
//       "X-CheckSum": xCheckSum,
//       "userid": Appid,
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//     }
//   };
//   //#endregion
//   var datas = [];
//   var req = http.request(options, function (res) {
//     console.log(res)
//     res.setEncoding('utf-8');
//     datas = [];
//
//     res.on('data', function (rersult) {
//       datas.push(rersult);
//     });
//     res.on('end', function () {
//       //  接收讯飞回调
//       var result = JSON.parse(datas.join(''));
//       if (result.code == "00000") {
//         httpRes.end(JSON.stringify(result.data));
//       } else {
//         console.log("讯飞接口识别录音错误" + result.code);
//         httpRes.end(result.desc);
//       }
//     });
//   });
//
//   req.on('error', function (err) {
//     console.log("发送到讯飞语音接口失败");
//     console.error(err);
//   });
//   req.write(bodyData);
//   req.end();
// }


Router.get('/test', function (ctx) {
  ctx.body = 'Hello world.'
});

app.use(Router.routes())
  .use(Router.allowedMethods());

app.listen(3000);