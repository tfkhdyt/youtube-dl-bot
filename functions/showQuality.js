const { Keyboard, Key } = require('telegram-keyboard');
const formatBytes = require('./formatBytes');

module.exports = (formats, audioFileSize) => {
  const keyCallback = formats.map((format) => {
    const id = format.format_id;
    const quality = format.format_note;
    const vcodec = format.vcodec.substring(0, 4).toUpperCase();
    const fileSize = formatBytes(format.filesize + audioFileSize);
    return Key.callback(`${quality} | ${vcodec} | ${fileSize}`, id);
  });
  
  return Keyboard.make(keyCallback, {
    columns: 2
  }).inline();
};