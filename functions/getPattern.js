module.exports = (quality) => {
  let num = 1;
  const pattern = [];
  for (let i = 0; i < quality.length; i++) {
    if (quality[i] == quality[i + 1]) {
      num++;
      continue;
    }
    pattern.push(num);
    num = 1;
  }
  return pattern;
};
