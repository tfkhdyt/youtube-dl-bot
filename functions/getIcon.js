module.exports = (quality) => {
  switch (quality) {
    case 'Audio':
      return '🎵';
    default:
      return '📽️';
  }
};
