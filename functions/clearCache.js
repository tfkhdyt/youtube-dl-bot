const fs = require('fs');

module.exports = (path) => {
  console.log('clearing cache...');
  fs.unlink(path, (err) => {
    if (err) throw err;
    console.log("File removed:", path);
  });
};