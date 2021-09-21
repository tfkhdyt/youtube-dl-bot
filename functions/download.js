const youtubedl = require('youtube-dl-exec');
const getMetadata = require('./getMetadata');

module.exports = async (url, formatCode, ctx) => {
  console.log('Downloading...');
  ctx.replyWithMarkdown('_⬇️ Sedang mengunduh..._')
  .then(m => {
    textLoad = m.message_id;
  });
  await youtubedl(url, {
    format: `${formatCode}+140`,
    mergeOutputFormat: 'mp4',
    output: `%(id)s-${formatCode}`,
    ffmpegLocation: "node_modules/ffmpeg-static/ffmpeg"
  })
  .then((data) => {
    console.log('Download:', data);
  });
  const id = await youtubedl(url, {
    getId: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true
  })
  .then(data => data);
  const judul = await youtubedl(url, {
    getTitle: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true
  })
  .then(data => data);
  
  console.log(`id: ${id}
judul: ${judul}`);
  ctx.deleteMessage(textLoad);
  return { id, judul };
};