const youtubedl = require('youtube-dl-exec');
const { Telegraf, Markup } = require('telegraf');
const { Composer } = require('micro-bot');
const { Keyboard, Key } = require('telegram-keyboard');
const fs = require('fs');
// const path = require('path');
const glob = require('glob');
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_DOMAIN = process.env.BOT_DOMAIN;
const PORT = process.env.PORT || 3000;
let url;
let loadText;

// Atur mode
switch (NODE_ENV) {
  case 'development': bot = new Telegraf(BOT_TOKEN); break;
  case 'production': bot = new Composer(); break;
} 

// functions
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

const getMetadata = (link, ctx) => {
  return youtubedl(link, {
    dumpSingleJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true
  })
  .then(data => data)
  .catch(err => {
    ctx.deleteMessage(textLoad);
    return ctx.reply('Video tidak ditemukan, pastikan link video tersebut sudah benar! 🙏🏼');
  });
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

let audioFileSize;
const getFormats = formats => {
  const audio = formats.find(format => format.format_id == '140');
  audioFileSize = audio.filesize;
  return formats.filter(format => format.fps != null && format.acodec == 'none');
};

const showQuality = formats => {
  const keyCallback = formats.map((format) => {
    const id = format.format_id;
    const quality = format.format_note;
    const fps = format.fps;
    const vcodec = format.vcodec.substring(0, 4).toUpperCase();
    const fileSize = formatBytes(format.filesize + audioFileSize);
    return Key.callback(`${quality} | ${vcodec} | ${fileSize}`, id);
  });
  
  return Keyboard.make(keyCallback, {
    columns: 2
  }).inline();
};

// command start
bot.start((ctx) => ctx.replyWithMarkdown(`Halo ${ctx.from.first_name}, selamat datang di YT-DL Bot, kirim link video yang ingin anda unduh untuk mengunduh video tersebut.

*PERHATIAN*: Dikarenakan storage hosting yang terbatas, maka kalian tidak dapat mengunduh video yang memiliki ukuran di atas *500 MB*`));

// command help
bot.command('help', (ctx) => ctx.reply(`Anda hanya perlu mengirimkan link dari video yang ingin diunduh`));

// command utama
let display_id, judul;
bot.on('text', async (ctx) => {
  url = ctx.message.text;
  const messageId = ctx.update.message.message_id;
  ctx.replyWithMarkdown('_🔎 Sedang mencari..._', {reply_to_message_id : messageId})
  .then(m => {
    textLoad = m.message_id;
  });
  
  // console.log(textLoad);
  
  const data = await getMetadata(url, ctx);
  const formats = getFormats(data.formats);
  
  display_id = data.display_id;
  judul = data.title;
  const tanggal = dateFormatter(data.upload_date);
  const channel = data.channel;
  const durasi = secondsToTimestamp(data.duration);
  const jmlPenonton = convertToICS(data.view_count);
  const jmlLike = convertToICS(data.like_count);
  const jmlDislike = convertToICS(data.dislike_count);
  const persenLike = (data.like_count / (data.like_count + data.dislike_count) * 100).toFixed(1) + '%';
  const persenDislike = (data.dislike_count / (data.like_count + data.dislike_count) * 100).toFixed(1) + '%';
  
  const metadata = `📄 *Judul*: \`${judul}\`
👨🏻 *Channel*: \`${channel}\`
📆 *Tanggal di-upload*: \`${tanggal}\`
🕖 *Durasi*: \`${durasi}\`
👀 *Jumlah penonton*: \`${jmlPenonton}\`
👍🏼 *Jumlah like*: \`${jmlLike} (${persenLike})\`
👎🏼 *Jumlah dislike*: \`${jmlDislike} (${persenDislike})\``;

  ctx.deleteMessage(textLoad);
  ctx.replyWithMarkdown(metadata, {
    reply_to_message_id: messageId
  });
  ctx.reply(`🎥 Pilih kualitas: `, showQuality(formats));
});

// callback
bot.on('callback_query', (ctx) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  const formatCode = ctx.callbackQuery.data;
 
  console.log('Downloading...');
  ctx.replyWithMarkdown('_⬇️ Sedang mengunduh..._')
  .then(m => {
    textLoad = m.message_id;
  });
  youtubedl(url, {
    format: `${formatCode}+140`,
    mergeOutputFormat: 'mp4',
    output: `%(id)s-${formatCode}`,
    ffmpegLocation: "node_modules/ffmpeg-static/ffmpeg"
  })
  .then(data => {
    console.log(data);
    ctx.deleteMessage(textLoad);
    console.log('Uploading...');
    ctx.replyWithMarkdown('_⬆️ Sedang mengunggah..._')
    .then(m => {
      textLoad = m.message_id;
    });
    // const newExt = path.extname(glob.sync(`*${display_id}-${formatCode}.*`)[0]).substring(1);
    // const fileToUpload = glob.sync(`*-${display_id}-${formatCode}.m*`)[0];
    const fileToUpload = `${display_id}-${formatCode}.mp4`;
    // console.log(fileToUpload);
    fs.readdir('./', (err, files) => {
      if (err) throw err;
      // files object contains all files names
      // log them on console
      files.forEach(file => {
        console.log(file);
      });
    });
    ctx.replyWithVideo(
      { 
        source: __dirname + '/' + fileToUpload
      },
      {
        ...Markup.inlineKeyboard([[
          Markup.button.url('💵 Donasi', 'https://donate.tfkhdyt.my.id/'),
          Markup.button.url('💻 Source Code', 'https://github.com/tfkhdyt/youtube-dl-bot/')
        ],[
          Markup.button.url('💠 Project saya yang lainnya', 'https://tfkhdyt.my.id/#portfolio')
        ]
      ]) 
    })
    .then(() => {
      ctx.deleteMessage(textLoad);
      const path = './' + fileToUpload;
      // fs.unlink(path, (err) => {
      //   if (err) throw err;
      //   console.log("File removed:", path);
      // });
      youtubedl(url, { 
        rmCacheDir: true,
        simulate: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true
      })
      .then(res => console.log(res));
    });
  });
});

switch(NODE_ENV) {
  case 'development': bot.launch(); break;
  case 'production': module.exports = bot; break;
}