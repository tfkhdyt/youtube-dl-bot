const { Markup } = require('telegraf');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const clearCache = require('./clearCache');

module.exports = async (info, formatCode, ctx, url) => {
  console.log('Uploading...');
  ctx.deleteMessage(textLoad);
  for (let i = 5; i >= 1; i--){
    ctx.replyWithMarkdown(`_⬆️ Sedang mengunggah..._\nProses ini mungkin sedikit lebih lama\nPesan ini akan hilang dalam hitungan ${i}...`)
    .then(m => textLoad = m.message_id);
    setTimeout(() => { ctx.deleteMessage(textLoad) }, 1000);
  }

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
  const path = './' + fileToUpload;
  clearCache(path, url, ctx);
};