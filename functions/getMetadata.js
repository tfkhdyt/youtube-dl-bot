const youtubedl = require('youtube-dl-exec');

module.exports = (link, ctx) => {
  return youtubedl(link, {
    dumpSingleJson: true,
    // proxy: 'https://114.199.80.100:8182',
    preferFreeFormats: true,
    youtubeSkipDashManifest: true
  })
  .then(data => data)
  .catch(err => {
    console.log('Error yang terjadi:', err);
    return youtubedl(link, {
      dumpSingleJson: true,
      proxy: 'https://114.199.80.100:8182',
      preferFreeFormats: true,
      youtubeSkipDashManifest: true
    })
    .then(data => data)
    .catch(err => {
      console.log('Error yang terjadi:', err);
      ctx.deleteMessage(textLoad);
      return ctx.reply('Video tidak ditemukan, pastikan link video tersebut sudah benar! 🙏🏼');
    });
  });
};