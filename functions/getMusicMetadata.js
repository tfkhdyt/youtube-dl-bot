const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const LASTFM_KEY = process.env.LASTFM_KEY;

const getMusicMetadata = (artis, judul) => {
  axios
    .get(
      `http://ws.audioscrobbler.com/2.0/?method=track.search&api_key=${LASTFM_KEY}&artist=${artis}&track=${judul}&format=json&limit=1`
    )
    .then((res) => console.log(res.data.results.trackmatches));
};
getMusicMetadata('MxPx', "Let's");
