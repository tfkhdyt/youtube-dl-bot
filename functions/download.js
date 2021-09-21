const youtubedl = require('youtube-dl-exec');
const getMetadata = require('./getMetadata');

module.exports = (url, formatCode, ctx) => {
  console.log('Downloading...');
  ctx.replyWithMarkdown('_⬇️ Sedang mengunduh..._')
  .then(m => {
    textLoad = m.message_id;
  });
  return youtubedl(url, {
    format: `${formatCode}+140`,
    mergeOutputFormat: 'mp4',
    output: `%(id)s-${formatCode}`,
    ffmpegLocation: "node_modules/ffmpeg-static/ffmpeg"
  })
  .then((data) => {
    console.log(data);
    ctx.deleteMessage(textLoad);
    return youtubedl(url, {
      dumpSingleJson: true,
      simulate: true
    })
    .then(data => {
      return {
        id: data.display_id,
        judul: data.title
      };
    });
  });
};