// import module
const { Telegraf } = require('telegraf');
const { Composer } = require('micro-bot');
require('dotenv').config();

// import function
const sendResult = require('./functions/sendResult');
const getMusicMetadata = require('./functions/getMusicMetadata');
const download = require('./functions/download');

// deklarasi & inisialisasi env variables
const NODE_ENV = process.env.NODE_ENV;
const BOT_TOKEN = process.env.BOT_TOKEN;
const API_ROOT = process.env.API_ROOT;

// deklarasi global variables
let url, bot, textLoad;

// Atur mode
switch (NODE_ENV) {
  case 'development':
    bot = new Telegraf(BOT_TOKEN, {
      telegram: {
        apiRoot: API_ROOT,
      },
    });
    break;
  case 'production':
    bot = new Composer();
    break;
}

// command start
bot.start((ctx) => {
  // console.log(ctx);
  ctx.replyWithMarkdown(
    `Halo @${ctx.from.username}, selamat datang di [YouTube Downloader Bot](https://t.me/tfkhdyt_ytdl_bot), kirim link video yang ingin anda unduh untuk mengunduh video tersebut.
Untuk video yang memiliki subtitle, maka secara otomatis semua subtitle itu akan ter-embed ke dalam video.
_*YouTube Downloader lain mana bisa_

*PERHATIAN*: 
- Bot tidur mulai jam 21:00 WIB sampai 04:00 WIB
- Dikarenakan storage hosting yang terbatas, maka kalian tidak dapat mengunduh video yang memiliki ukuran di atas *450 MB*
- Anda tidak dapat mengunduh video yang mempunyai geo-restriction (Contoh: *Muse Indonesia*)`,
    {
      disable_web_page_preview: true,
    }
  );
});

// command help
bot.command('help', (ctx) =>
  ctx.reply(`Anda hanya perlu mengirimkan link dari video yang ingin diunduh`)
);

// command utama
bot.on('text', (ctx) => {
  url = ctx.message.text;
  const messageId = ctx.update.message.message_id;
  textLoad = sendResult(url, ctx, messageId);
});

// callback
bot.on('callback_query', async (ctx) => {
  ctx.deleteMessage(textLoad);
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  let callbackQuery = ctx.callbackQuery.data;
  callbackQuery = callbackQuery.split(',');
  const formatCode = callbackQuery[0];
  const display_id = callbackQuery[1];
  const info = await getMusicMetadata(display_id, formatCode);
  console.log('Metadata:', info);
  download(ctx, info);
});

switch (NODE_ENV) {
  case 'development':
    bot.launch();
    break;
  case 'production':
    module.exports = {
      bot,
      options: {
        telegram: {
          apiRoot: API_ROOT,
        },
      },
    };
    break;
}
