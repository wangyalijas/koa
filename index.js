const Koa = require('koa');
const fs = require("fs");
const Router = require('koa-router')();
const app = new Koa();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const multiparty = require('multiparty');


const parseAudio = require('./parseAudio');


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
        // xf_recogn(newPath, ctx.res);
          parseAudio(
              newPath,
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
      })
      .save(newPath)
  });

});

Router.get('/test', function (ctx) {
  ctx.body = 'Hello world.'
});

app.use(Router.routes())
  .use(Router.allowedMethods());

app.listen(3000);