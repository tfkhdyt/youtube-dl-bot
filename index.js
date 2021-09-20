const youtubedl = require('youtube-dl-exec');

const monthNumberToString = month => {
  switch(month){
    case '01': return 'Januari';
    case '02': return 'Februari'; 
    case '03': return 'Maret';
    case '04': return 'April';
    case '05': return 'Mei';
    case '06': return 'Juni';
    case '07': return 'Juli';
    case '08': return 'Agustus';
    case '09': return 'September';
    case '10': return 'Oktober';
    case '11': return 'November';
    case '12': return 'Desember';
  }
};

const dateFormatter = string => {
  const date = string.substring(6, 8);
  const month = string.substring(4, 6);
  const year = string.substring(0, 4);
  return `${date} ${monthNumberToString(month)} ${year}`;
};

const secondsToTimestamp = seconds => {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

const formatNumber = num => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

const convertToICS = (labelValue) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e+9 ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1) + " miliar"
  // Six Zeroes for Millions 
  : Math.abs(Number(labelValue)) >= 1.0e+6 ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + " juta"
  // Three Zeroes for Thousands
  : Math.abs(Number(labelValue)) >= 1.0e+3 ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1) + " ribu"
  : Math.abs(Number(labelValue));
};

const getMetadata = link => {
  return youtubedl('https://m.youtube.com/watch?v=oL_ePYZ1IZY', {
    dumpSingleJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true
  })
  .then(data => data);
};

const main = async () => {
  const url = 'https://m.youtube.com/watch?v=oL_ePYZ1IZY';
  const data = await getMetadata(url);
  
  const judul = data.title;
  const tanggal = dateFormatter(data.upload_date);
  const channel = data.channel;
  const durasi = secondsToTimestamp(data.duration);
  const jmlPenonton = convertToICS(data.view_count);
  const jmlLike = convertToICS(data.like_count);
  const jmlDislike = convertToICS(data.dislike_count);
  
  const metadata = `Judul: ${judul}
Tanggal: ${tanggal}
Channel: ${channel}
Durasi: ${durasi}
Jumlah penonton: ${jmlPenonton}
Jumlah like: ${jmlLike}
Jumlah dislike: ${jmlDislike}`;

  console.log(metadata);
};

main();