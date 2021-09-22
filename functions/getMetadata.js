const youtubedl = require('youtube-dl-exec');

module.exports = (link, ctx) => {
  return youtubedl(link, {
    dumpSingleJson: true,
    geoBypassCountry: 'ID',
    preferFreeFormats: true,
    youtubeSkipDashManifest: true
  })
  .then(data => data)
  .catch(err => {
    ctx.deleteMessage(textLoad);
    return ctx.reply('Video tidak ditemukan, pastikan link video tersebut sudah benar! 🙏🏼');
  });
};