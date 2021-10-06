const { Keyboard, Key } = require('telegram-keyboard');
const formatBytes = require('./formatBytes');
const getIcon = require('./getIcon');
// const getPattern = require('./getPattern');

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
      `${id},${info.display_id},${quality},${fileSize}`
    );
  });
  // console.log(keyCallback);
  /*const quality = formats.map((format) => {
    return format.format_note == 'tiny' ? 'Audio' : format.format_note;
  });
  const pattern = getPattern(quality);*/
  // console.log(pattern);
  // console.log('Pattern:', pattern);

  return Keyboard.make(keyCallback, {
    wrap: (row, index) => {
      // console.log(row, index);
      if (index == 1) return row.length == 1;
      return row.length == 2;
    },
    // pattern,
  }).inline();
};
