module.exports = (formats) => {
  const audio = formats.find((format) => format.format_id == '140');
  const audioFileSize = audio.filesize;
  // console.log(formats);
  formats = formats.filter(
    (format) => format.format_id == '140' || format.acodec == 'none'
  );
  // console.log(formats);
  return { formats, audioFileSize };
};
