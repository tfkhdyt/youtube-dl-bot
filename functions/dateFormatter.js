module.exports = string => {
  const date = string.substring(6, 8);
  const month = string.substring(4, 6);
  const year = string.substring(0, 4);
  return `${date} ${monthNumberToString(month)} ${year}`;
};