module.exports = (formats) => {
  const audio = formats.find((format) => format.format_id == '140');
  const audioFileSize = audio.filesize;
  formats = formats.filter(
    (format) => format.fps != null && format.acodec == 'none'
  );
  return { formats, audioFileSize };
};
