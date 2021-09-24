const youtubedl = require('youtube-dl-exec');
const upload = require('./upload');

module.exports = (url, formatCode, ctx, info) => {
  console.log('Downloading...');
  ctx.replyWithMarkdown('_⬇️ Sedang mengunduh..._')
  .then(m => info.textLoad = m.message_id);
  //setTimeout(() => { ctx.deleteMessage(textLoad); }, 5000);
  
  youtubedl(url, {
    format: `${formatCode}+140`,
    mergeOutputFormat: 'mp4',
    c: true,
    ignoreErrors: true,
    externalDownloader: 'ffmpeg',
    verbose: true,
    // proxy: 'https://114.199.80.100:8182',
    output: `%(id)s-${formatCode}`,
    ffmpegLocation: "node_modules/ffmpeg-static/ffmpeg",
    rmCacheDir: true
  })
  .then((data) => {
    console.log('Download:', data);
    upload(info, formatCode, ctx);
  })
  .catch(err => {
    console.log('Error yang terjadi saat download:', err);
  });
};