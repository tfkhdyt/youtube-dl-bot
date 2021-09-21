const getMetadata = require('./getMetadata');
const getFormats = require('./getFormats');
const dateFormatter = require('./dateFormatter');
const secondsToTimestamp = require('./secondsToTimestamp');
const convertToICS = require('./convertToICS');
const showQuality = require('./showQuality');

module.exports = async (url, ctx) => {
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
};