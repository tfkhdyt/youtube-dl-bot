const youtubedl = require('youtube-dl-exec');
const upload = require('./upload');

module.exports = (url, formatCode, ctx, info) => {
  console.log('Downloading...');
  ctx
    .replyWithMarkdown('_⬇️ Sedang mengunduh..._')
    .then((m) => (info.textLoad = m.message_id));
  //setTimeout(() => { ctx.deleteMessage(textLoad); }, 5000);
  const audioOption = {
    format: `${formatCode}`,
    c: true,
    ignoreErrors: true,
    externalDownloader: 'ffmpeg',
    verbose: true,
    output: `%(id)s-${formatCode}`,
    ffmpegLocation: 'node_modules/ffmpeg-static/ffmpeg',
    rmCacheDir: true,
  };

  const videoOption = {
    format: `${formatCode}+140`,
    mergeOutputFormat: 'mp4',
    c: true,
    ignoreErrors: true,
    externalDownloader: 'ffmpeg',
    verbose: true,
    output: `%(id)s-${formatCode}`,
    ffmpegLocation: 'node_modules/ffmpeg-static/ffmpeg',
    rmCacheDir: true,
    allSubs: true,
    embedSubs: true,
  };

  const option = formatCode == '140' ? audioOption : videoOption;
  youtubedl(url, option)
    .then((data) => {
      console.log('Download:', data);
      upload(info, formatCode, ctx);
    })
    .catch((err) => {
      console.log('Error yang terjadi saat download:', err);
    });
};
