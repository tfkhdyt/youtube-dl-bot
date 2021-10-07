const youtubedl = require('youtube-dl-exec');
const upload = require('./upload');
const writeMusicTag = require('./writeMusicTag');

module.exports = (ctx, info) => {
  console.log('Downloading...');
  ctx
    .replyWithMarkdown(
      `_⬇️ Sedang mengunduh..._
      
📄 *Judul*: \`${info.judul}\`
📹 *Kualitas*: \`${info.quality}\`
💾 *Ukuran*: \`${info.fileSize}\``
    )
    .then((m) => (info.textLoad = m.message_id));
  //setTimeout(() => { ctx.deleteMessage(textLoad); }, 5000);
  const audioOption = {
    extractAudio: true,
    audioFormat: 'mp3',
    audioQuality: '0',
    c: true,
    // ignoreErrors: true,
    socketTimeout: 1,
    retries: 'infinite',
    verbose: true,
    output: `%(id)s-${info.formatCode}.%(ext)s`,
    ffmpegLocation: 'node_modules/ffmpeg-static/ffmpeg',
    rmCacheDir: true,
  };

  const videoOption = {
    format: `${info.formatCode}+140`,
    mergeOutputFormat: 'mp4',
    c: true,
    // ignoreErrors: true,
    socketTimeout: 1,
    retries: 'infinite',
    verbose: true,
    output: `%(id)s-${info.formatCode}`,
    ffmpegLocation: 'node_modules/ffmpeg-static/ffmpeg',
    rmCacheDir: true,
    allSubs: true,
    embedSubs: true,
  };

  const option = info.formatCode == '140' ? audioOption : videoOption;

  youtubedl(`https://youtu.be/${info.display_id}`, option)
    .then((data) => {
      console.log('Download success:', data);
      if (info.formatCode == '140') {
        writeMusicTag(ctx, info);
      } else {
        upload(ctx, info);
      }
    })
    .catch((err) => {
      console.log('Error yang terjadi saat download:', err);
    });
};
