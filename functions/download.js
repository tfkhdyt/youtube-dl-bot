const { Markup } = require('telegraf');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const getMetadata = require('./getMetadata');

module.exports = (url, formatCode, ctx) => {
  console.log('Downloading...');
  ctx.replyWithMarkdown('_⬇️ Sedang mengunduh..._')
  .then(m => {
    textLoad = m.message_id;
  });
  youtubedl(url, {
    format: `${formatCode}+140`,
    mergeOutputFormat: 'mp4',
    output: `%(id)s-${formatCode}`,
    ffmpegLocation: "node_modules/ffmpeg-static/ffmpeg"
  })
  .then(async (data) => {
    console.log(data);
    ctx.deleteMessage(textLoad);
    console.log('Uploading...');
    ctx.replyWithMarkdown('_⬆️ Sedang mengunggah..._')
    .then(m => {
      textLoad = m.message_id;
    });

    const metadata = await getMetadata(url, ctx);
    const id = metadata.display_id;
    const judul = metadata.title;

    const fileToUpload = `${id}-${formatCode}.mp4`;
    // console.log(fileToUpload);
    fs.readdir('./', (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        console.log(file);
      });
    });
    ctx.replyWithVideo(
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
      const path = './' + fileToUpload;
      fs.unlink(path, (err) => {
        if (err) throw err;
        console.log("File removed:", path);
      });
      youtubedl(url,
        {
          rmCacheDir: true,
          simulate: true,
          noWarnings: true,
          noCallHome: true,
          noCheckCertificate: true,
        })
      .then(res => console.log(res));
    });
  });
};