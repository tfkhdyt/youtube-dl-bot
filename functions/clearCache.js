const glob = require('glob');
const fs = require('fs');

module.exports = (path, url, ctx) => {
  console.log('clearing cache...');
  glob("*.mp4", (er, files) => {
    for (const file of files) {
      // remove file
      fs.unlink(file, (err) => {
        if (err) throw err;
        console.log("File removed:", path);
      });
    }
  });
};