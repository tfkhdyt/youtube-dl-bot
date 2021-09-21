// import module
const { Telegraf, Markup } = require('telegraf');
const { Composer } = require('micro-bot');
const youtubedl = require('youtube-dl-exec');
const glob = require('glob');
const fs = require('fs');
require('dotenv').config();

// deklarasi & inisialisasi env variables
const NODE_ENV = process.env.NODE_ENV;
const BOT_TOKEN = process.env.BOT_TOKEN;
const API_ROOT = process.env.API_ROOT;

// deklarasi global variables
let url, loadText, audioFileSize, display_id, judul;

// Atur mode
switch (NODE_ENV) {
  case 'development': bot = new Telegraf(BOT_TOKEN); break;
  case 'production': bot = new Composer(); break;
} 

// command start
bot.start((ctx) => ctx.replyWithMarkdown(`Halo ${ctx.from.first_name}, selamat datang di YT-DL Bot, kirim link video yang ingin anda unduh untuk mengunduh video tersebut.

*PERHATIAN*: Dikarenakan storage hosting yang terbatas, maka kalian tidak dapat mengunduh video yang memiliki ukuran di atas *450 MB*`));

// command help
bot.command('help', (ctx) => ctx.reply(`Anda hanya perlu mengirimkan link dari video yang ingin diunduh`));

// command utama
bot.on('text', (ctx) => {
  url = ctx.message.text;
  const messageId = ctx.update.message.message_id;
  ctx.replyWithMarkdown('_🔎 Sedang mencari..._', {reply_to_message_id : messageId})
  .then(m => {
    textLoad = m.message_id;
  });
  
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
        source: fileToUpload,
        filename: judul + '.mp4'
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
      fs.unlink(path, (err) => {
        if (err) throw err;
        console.log("File removed:", path);
      });
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
  case 'production': module.exports = {
    bot,
    options: {
      telegram: {
        apiRoot: API_ROOT
      }
    }
  }; break;
}

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))