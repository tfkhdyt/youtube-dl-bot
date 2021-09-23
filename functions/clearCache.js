const fs = require('fs');

module.exports = (path, url, ctx) => {
  console.log('clearing cache...');
  fs.unlink(file, (err) => {
    if (err) throw err;
    console.log("File removed:", path);
  });
};