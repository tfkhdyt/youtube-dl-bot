const { Markup } = require('telegraf');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const clearCache = require('./clearCache');

module.exports = async (info, formatCode, ctx, url) => {
  console.log('Uploading...');
  ctx.deleteMessage(textLoad);
  ctx.replyWithMarkdown('_⬆️ Sedang mengunggah..._')
  .then(m => textLoad = m.message_id);
  console.log('message id dari pesan "sedang memproses":', textLoad);

  const fileToUpload = `${info.id}-${formatCode}.mp4`;
  console.log(fileToUpload);
  fs.readdir('./', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      console.log(file);
    });
  });
  await ctx.replyWithVideo(
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
  .catch(err => {
    console.log('Error yang terjadi saat upload:', err);
  });
  ctx.deleteMessage(textLoad);
  const path = './' + fileToUpload;
  clearCache(path, url, ctx);
};