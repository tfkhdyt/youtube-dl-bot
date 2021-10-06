const { Markup } = require('telegraf');
const fs = require('fs');
const clearCache = require('./clearCache');

module.exports = (ctx, info) => {
  const metadata = `${info.metadata}
📹 *Kualitas*: \`${info.quality}\`
💾 *Ukuran*: \`${info.fileSize}\``;
  fs.readdir('./', (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      console.log(file);
    });
  });
  console.log('Uploading...');
  ctx.deleteMessage(info.textLoad);
  ctx
    .replyWithMarkdown(
      `_⬆️ Sedang mengunggah..._\n\nProses ini mungkin sedikit lebih lama`
    )
    .then((m) => (info.textLoad = m.message_id));
  setTimeout(() => {
    ctx.deleteMessage(info.textLoad);
  }, 5000);

  // console.log('message id dari pesan "sedang memproses":', info.textLoad);

  let extension = info.formatCode == '140' ? 'mp3' : 'mp4';

  const fileToUpload = `${info.display_id}-${info.formatCode}.${extension}`;
  // extension = info.formatCode == '140' ? 'mp3' : 'mp4';
  console.log('Nama file output:', fileToUpload);

  const send =
    info.formatCode == '140' ? ctx.replyWithAudio : ctx.replyWithVideo;
  console.log(info.judul);
  send(
    {
      source: fs.createReadStream(fileToUpload),
      filename: info.judul + `.${extension}`,
    },
    {
      caption: metadata,
      parse_mode: 'Markdown',
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
    .then(() => {
      console.log('Upload success:');
      const path = './' + fileToUpload;
      clearCache(path);
    })
    .catch((err) => {
      console.log('Error yang terjadi saat upload:', err);
    });
};
