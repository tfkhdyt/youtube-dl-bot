const youtubedl = require('youtube-dl-exec');

module.exports = (info, ctx) => {
  return youtubedl(info.url, {
    dumpSingleJson: true,
    // proxy: 'https://114.199.80.100:8182',
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
  })
    .then((data) => data)
    .catch((err) => {
      console.log('Error yang terjadi:', err);
      ctx.deleteMessage(info.textLoad);
      return ctx.replyWithMarkdown(
        `Maaf, terjadi *error!*
Ada 3 kemungkinan:
- Link video tidak valid
- Video dilimit geo-restriction
- Video yang diunduh menggunakan format [DASH](https://en.m.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP), bot ini tidak dapat mendownload video DASH. Sebagai alternatif, Anda dapat menggunakan website [ini](https://yt1s.com/en25)`,
        {
          disable_web_page_preview: true,
        }
      );
    });
};
