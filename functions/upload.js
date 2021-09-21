const { Markup } = require('telegraf');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');

module.exports = (id, judul, formatCode, ctx) => {
  console.log('Uploading...');
  ctx.replyWithMarkdown('_⬆️ Sedang mengunggah..._')
  .then(m => {
    textLoad = m.message_id;
  });
    
  const fileToUpload = `${id}-${formatCode}.mp4`;
  // console.log(fileToUpload);
  fs.readdir('./', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      console.log(file);
    });
  });
  return ctx.replyWithVideo(
    {
      source: fileToUpload,
      filename: judul + '.mp4'
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
    ctx.deleteMessage(textLoad);
    return './' + fileToUpload;
  });
};