const { Markup } = require('telegraf');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const clearCache = require('./clearCache');

module.exports = (info, formatCode, ctx, url) => {
  console.log('Uploading...');
  console.log('message id dari pesan "sedang memproses":', info.textLoad);
    
  const fileToUpload = `${info.id}-${formatCode}.mp4`;
  console.log(fileToUpload);
  fs.readdir('./', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      console.log(file);
    });
  });
  ctx.replyWithVideo(
    {
      source: fs.createReadStream('./' + fileToUpload),
      filename: info.judul + '.mp4'
    },
    {
      ...Markup.inlineKeyboard([[
        Markup.button.url('💵 Donasi', 'https://donate.tfkhdyt.my.id/'),
        Markup.button.url('💻 Source Code', 'https://github.com/tfkhdyt/youtube-dl-bot/')
      ], [
        Markup.button.url('💠 Project saya yang lainnya', 'https://tfkhdyt.my.id/#portfolio')
      ]
      ])
    })
  .then(() => {
    ctx.deleteMessage();
    const path =  './' + fileToUpload;
    clearCache(path, url);
  })
  .catch(err => {
    console.log('Error yang terjadi saat upload:', err);
  });
};