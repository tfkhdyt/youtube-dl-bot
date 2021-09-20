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

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFormats = formats => {
  const audio = formats.find(format => format.format_id == '140');
  const audioFileSize = audio.filesize;
  return formats.filter(format => format.fps != null && format.acodec == 'none')
  .map(format => {
    const id = format.format_id;
    const quality = format.format_note;
    const fps = format.fps;
    // const extension = format.ext;
    const vcodec = format.vcodec;
    const fileSize = formatBytes(format.filesize + audioFileSize);
    
    return `${quality} | ${fps} FPS | ${vcodec} | ${fileSize}`;
  }).join('\n');
};

(async () => {
  const url = 'https://m.youtube.com/watch?v=fM1xZlEiyk8';
  const data = await getMetadata(url);
  
  const judul = data.title;
  const tanggal = dateFormatter(data.upload_date);
  const channel = data.channel;
  const durasi = secondsToTimestamp(data.duration);
  const jmlPenonton = convertToICS(data.view_count);
  const jmlLike = convertToICS(data.like_count);
  const jmlDislike = convertToICS(data.dislike_count);
  
  const formats = await getFormats(data.formats);
  
  const metadata = `Judul: ${judul}
Tanggal: ${tanggal}
Channel: ${channel}
Durasi: ${durasi}
Jumlah penonton: ${jmlPenonton}
Jumlah like: ${jmlLike}
Jumlah dislike: ${jmlDislike}`;

  console.log(metadata + '\n');
  console.log('Pilih kualitas:\n' + formats);
})();