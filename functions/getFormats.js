module.exports = formats => {
  const audio = formats.find(format => format.format_id == '140');
  audioFileSize = audio.filesize;
  return formats.filter(format => format.fps != null && format.acodec == 'none');
};