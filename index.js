const youtubedl = require('youtube-dl-exec');

youtubedl('https://m.youtube.com/watch?v=oL_ePYZ1IZY', {
  dumpSingleJson: true,
  noWarnings: true,
  noCallHome: true,
  noCheckCertificate: true,
  preferFreeFormats: true,
  youtubeSkipDashManifest: true
})
.then(output => console.log(output));