const youtubedl = require('youtube-dl-exec');

module.exports = async (display_id, formatCode) => {
  return await youtubedl(`https://youtu.be/${display_id}`, {
    dumpSingleJson: true,
    youtubeSkipDashManifest: true,
  }).then((res) => {
    let info = {};
    info.judul = res.title;
    info.track = res.track;
    info.artis = res.artist;
    info.channel = res.channel;
    info.thumbnail = res.thumbnail;
    info.formatCode = formatCode;
    info.display_id = display_id;
    return info;
  });
};
