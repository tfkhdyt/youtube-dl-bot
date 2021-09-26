const youtubedl = require('youtube-dl-exec');
const upload = require('./upload');

module.exports = (ctx, info) => {
  console.log('Downloading...');
  ctx
    .replyWithMarkdown('_⬇️ Sedang mengunduh..._')
    .then((m) => (info.textLoad = m.message_id));
  //setTimeout(() => { ctx.deleteMessage(textLoad); }, 5000);
  const audioOption = {
    format: `${info.formatCode}`,
    audioFormat: 'mp3',
    c: true,
    ignoreErrors: true,
    externalDownloader: 'ffmpeg',
    verbose: true,
    output: `%(id)s-${info.formatCode}.mp3`,
    ffmpegLocation: 'node_modules/ffmpeg-static/ffmpeg',
    rmCacheDir: true,
  };

  const videoOption = {
    format: `${info.formatCode}+140`,
    mergeOutputFormat: 'mp4',
    c: true,
    ignoreErrors: true,
    externalDownloader: 'ffmpeg',
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
      console.log('Download:', data);
      upload(ctx, info);
    })
    .catch((err) => {
      console.log('Error yang terjadi saat download:', err);
    });
};
