const { Markup } = require('telegraf');
const fs = require('fs');
const clearCache = require('./clearCache');

module.exports = async (info, formatCode, ctx) => {
  console.log('Uploading...');
  ctx.deleteMessage(info.textLoad);
  ctx
    .replyWithMarkdown(
      `_⬆️ Sedang mengunggah..._\nProses ini mungkin sedikit lebih lama`
    )
    .then((m) => (info.textLoad = m.message_id));
  setTimeout(() => {
    ctx.deleteMessage(info.textLoad);
  }, 5000);

  console.log('message id dari pesan "sedang memproses":', info.textLoad);

  const fileToUpload = `${info.id}-${formatCode}.mp4`;
  console.log(fileToUpload);
  fs.readdir('./', (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      console.log(file);
    });
  });
  await ctx
    .replyWithVideo(
      {
        source: fs.createReadStream('./' + fileToUpload),
        filename: info.judul + '.mp4',
      },
      {
        ...Markup.inlineKeyboard([
          [
            Markup.button.url('💵 Donasi', 'https://donate.tfkhdyt.my.id/'),
            Markup.button.url(
              '💻 Source Code',
              'https://github.com/tfkhdyt/youtube-dl-bot/'
            ),
          ],
          [
            Markup.button.url(
              '💠 Project saya yang lainnya',
              'https://tfkhdyt.my.id/#portfolio'
            ),
          ],
        ]),
      }
    )
    .then((res) => {
      console.log('Upload:', res);
      const path = './' + fileToUpload;
      clearCache(path);
    })
    .catch((err) => {
      console.log('Error yang terjadi saat upload:', err);
    });
};
