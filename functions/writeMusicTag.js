const ffmetadata = require('ffmetadata');
const upload = require('./upload');
ffmetadata.setFfmpegPath('node_modules/ffmpeg-static/ffmpeg');

module.exports = (ctx, info) => {
  console.log('Writing metadata...');
  const metadata = {
    title: info.track || info.judul,
    album: info.track || '',
    artist: info.artis || info.channel,
  };
  // const albumArt = {
    attachments: [info.albumArt] || []
  };
  ffmetadata.write(
    `${info.display_id}-${info.formatCode}.mp3`,
    metadata,
    // albumArt,
    async (err) => {
      if (err) {
        console.error('Error writing metadata', err);
      } else {
        console.log('Data written');
        await ffmetadata.read(
          `${info.display_id}-${info.formatCode}.mp3`,
          (err, data) => {
            if (err) console.error('Error reading metadata', err);
            else console.log(data);
          }
        );
        upload(ctx, info);
      }
    }
  );
};
