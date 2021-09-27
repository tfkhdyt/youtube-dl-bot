const youtubedl = require('youtube-dl-exec');
const axios = require('axios');

require('dotenv').config({ path: '../.env' });
const LASTFM_KEY = process.env.LASTFM_KEY;

module.exports = async (display_id, formatCode) => {
  return await youtubedl(
    `https://youtu.be/${display_id}`,
    //`https://youtu.be/W5ct9ynWya0`,
    {
      dumpSingleJson: true,
      youtubeSkipDashManifest: true,
    }
  ).then((res) => {
    let info = {};
    info.judul = res.title;
    info.track = res.track;
    info.artis = res.artist;
    info.channel = res.channel;
    info.thumbnail = res.thumbnail;
    info.formatCode = formatCode;
    info.display_id = display_id;
    return axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?method=track.search&artist=${info.artis}&track=${info.track}&api_key=${LASTFM_KEY}&format=json`
      )
      .then((res) => {
        const data = res.data.results.trackmatches.track[0];
        console.log(data);
        info.track = data.name;
        info.artis = data.artist;
        info.albumArt = data.image[data.image.length - 1]['#text'];
        // console.log(info.albumArt);
        return info;
      })
      .catch(() => {
        return info;
      });
    // return info;
  });
};
