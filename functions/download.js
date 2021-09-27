const youtubedl = require('youtube-dl-exec');
const ffmetadata = require('ffmetadata');
const upload = require('./upload');

ffmetadata.setFfmpegPath('node_modules/ffmpeg-static/ffmpeg');

module.exports = (ctx, info) => {
  console.log('Downloading...');
  ctx
  .replyWithMarkdown('_⬇️ Sedang mengunduh..._')
  .then((m) => (info.textLoad = m.message_id));
  //setTimeout(() => { ctx.deleteMessage(textLoad); }, 5000);
  const audioOption = {
    format: `${info.formatCode}`,
    // audioFormat: 'aac',
    c: true,
    ignoreErrors: true,
    externalDownloader: 'ffmpeg',
    verbose: true,
    output: `%(id)s-${info.formatCode}.aac`,
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

  const option = info.formatCode == '140' ? audioOption: videoOption;

  const metadata = {
    title: info.track || info.judul,
    artist: info.artist || info.channel,
  };

  youtubedl(`https://youtu.be/${info.display_id}`, option)
  .then((data) => {
    console.log('Download:', data);
    if (info.formatCode == '140') {
      ffmetadata.write(
        `${info.display_id}-${info.formatCode}.aac`,
        metadata,
        async (err) => {
          if (err) {
            console.error('Error writing metadata', err);
          } else {
            console.log('Data written');
            await ffmetadata.read(`${info.display_id}-${info.formatCode}.aac`, function(err, data) {
              if (err) console.error("Error reading metadata", err);
              else console.log(data);
            });
            upload(ctx,
              info);
          }
        }
      );
    } else {
      upload(ctx, info);
    }
  })
  .catch((err) => {
    console.log('Error yang terjadi saat download:', err);
  });
};