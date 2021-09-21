// import module
const { Telegraf } = require('telegraf');
const { Composer } = require('micro-bot');
const glob = require('glob');
require('dotenv').config();

// import function
const sendResult = require('./functions/sendResult');
const download = require('./functions/download');
const upload = require('./functions/upload');
const clearCache = require('./functions/clearCache');

// deklarasi & inisialisasi env variables
const NODE_ENV = process.env.NODE_ENV;
const BOT_TOKEN = process.env.BOT_TOKEN;
const API_ROOT = process.env.API_ROOT;

// deklarasi global variables
let url, audioFileSize;

// Atur mode
switch (NODE_ENV) {
  case 'development': bot = new Telegraf(BOT_TOKEN, {
    telegram: {
      apiRoot: API_ROOT
    }
  }); break;
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
  
  sendResult(url, ctx, messageId);
});

// callback
bot.on('callback_query', async (ctx) => {
  ctx.deleteMessage(ctx.update.callback_query.message.message_id);
  const formatCode = ctx.callbackQuery.data;
  
  const { id, judul } = await download(url, formatCode, ctx);
  const path = await upload(id, judul, formatCode, ctx);
  clearCache(path, url);
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

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));