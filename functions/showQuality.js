const { Keyboard, Key } = require('telegram-keyboard');
const formatBytes = require('./formatBytes');
const getIcon = require('./getIcon');

module.exports = (formats, audioFileSize, info) => {
  const keyCallback = formats.map((format) => {
    const id = format.format_id;
    const quality = format.format_note == 'tiny' ? 'Audio' : format.format_note;
    const icon = getIcon(quality);
    let vcodec = format.vcodec.substring(0, 3).toUpperCase();
    switch (vcodec) {
      case 'AV0':
        vcodec = 'AV1';
        break;
      case 'NON':
        vcodec = 'MP3';
    }
    const fileSize =
      vcodec != 'MP3'
        ? formatBytes(format.filesize + audioFileSize)
        : formatBytes(format.filesize);
    return Key.callback(
      `${icon} ${quality} | ${vcodec} | ${fileSize}`,
      `${id},${info.display_id}`
    );
  });

  return Keyboard.make(keyCallback, {
    columns: 2,
  }).inline();
};
