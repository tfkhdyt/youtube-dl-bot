const { Keyboard, Key } = require('telegram-keyboard');
const formatBytes = require('./formatBytes');

module.exports = (formats, audioFileSize) => {
  const keyCallback = formats.map((format) => {
    const id = format.format_id;
    const quality = (format.format_note == 'tiny') ? 'Audio' : format.format_note;
    let vcodec = format.vcodec.substring(0, 4).toUpperCase();
    switch (vcodec) {
      case 'AVC1':
        vcodec = 'AVC';
        break;
      case 'AV01':
        vcodec = 'AV1';
        break;
      case 'NONE':
        vcodec = 'MP3';
    }
    const fileSize = (vcodec != 'MP3') ? formatBytes(format.filesize + audioFileSize) : formatBytes(format.filesize);
    return Key.callback(`${quality} | ${vcodec} | ${fileSize}`, id);
  });

  return Keyboard.make(keyCallback, {
    columns: 2,
  }).inline();
};
