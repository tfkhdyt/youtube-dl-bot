const getMetadata = require('./getMetadata');
const getFormats = require('./getFormats');
const dateFormatter = require('./dateFormatter');
const secondsToTimestamp = require('./secondsToTimestamp');
const convertToICS = require('./convertToICS');
const showQuality = require('./showQuality');

module.exports = async (url, ctx, messageId) => {
  console.log('Searching');
  let info = {};
  info.url = url;
  ctx
    .replyWithMarkdown('_🔎 Sedang mencari..._', {
      reply_to_message_id: messageId,
    })
    .then((m) => {
      info.textLoad = m.message_id;
    });

  const data = await getMetadata(info, ctx);
  const { formats, audioFileSize } = getFormats(data.formats);

  const judul = data.title;
  const id = data.display_id;
  info.display_id = id;
  const tanggal = dateFormatter(data.upload_date);
  const channel = data.channel;
  const durasi = secondsToTimestamp(data.duration);
  const jmlPenonton = convertToICS(data.view_count);
  const jmlLike = convertToICS(data.like_count);
  const jmlDislike = convertToICS(data.dislike_count);
  const persenLike =
    ((data.like_count / (data.like_count + data.dislike_count)) * 100).toFixed(
      1
    ) + '%';
  const persenDislike =
    (
      (data.dislike_count / (data.like_count + data.dislike_count)) *
      100
    ).toFixed(1) + '%';
  const metadata = `📄 *Judul*: \`${judul}\`
👨🏻 *Channel*: \`${channel}\`
📆 *Tanggal*: \`${tanggal}\`
🕖 *Durasi*: \`${durasi}\`
👀 *Penayangan*: \`${jmlPenonton}\`
👍🏼 *Like*: \`${jmlLike} (${persenLike})\`
👎🏼 *Dislike*: \`${jmlDislike} (${persenDislike})\``;

  ctx
    .replyWithMarkdown(metadata, {
      reply_to_message_id: messageId,
    })
    .then(() => {
      ctx.deleteMessage(info.textLoad);
      ctx.reply(
        `🎥 Pilih kualitas: `,
        showQuality(formats, audioFileSize, info)
      );
    });
  console.log(id, judul);
  return { id, judul };
};
