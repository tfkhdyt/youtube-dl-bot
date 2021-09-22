const youtubedl = require('youtube-dl-exec');
const getMetadata = require('./getMetadata');
const upload = require('./upload');

module.exports = (url, formatCode, ctx, info) => {
  console.log('Downloading...');
  ctx.replyWithMarkdown('_⬇️ Sedang mengunduh..._')
  .then(m => {
    textLoad = m.message_id;
  });
  youtubedl(url, {
    format: `${formatCode}+140`,
    mergeOutputFormat: 'mp4',
    continue: true,
    proxy: 'https://114.199.80.100:8182',
    output: `%(id)s-${formatCode}`,
    ffmpegLocation: "node_modules/ffmpeg-static/ffmpeg",
    rmCacheDir: true
  })
  .then((data) => {
    ctx.deleteMessage(textLoad);
    console.log('Download:', data);
    upload(info, formatCode, ctx, url);
  });
};