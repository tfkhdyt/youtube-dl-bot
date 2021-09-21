const youtubedl = require('youtube-dl-exec');
const fs = require('fs');

module.exports = (path, url) => {
  console.log('clearing cache...');
  fs.unlink(path, (err) => {
    if (err) throw err;
    console.log("File removed:", path);
  });
  youtubedl(url,
    {
      rmCacheDir: true,
      simulate: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
    })
  .then(res => console.log(res));
};