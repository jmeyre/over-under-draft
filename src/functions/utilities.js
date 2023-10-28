const colors = ["#1984c5", "#22a7f0", "#63bff0", "#a7d5ed", "#e2e2e2", "#e1a692", "#de6e56", "#e14b31", "#c23728"];
export const getBackgroundColor = (score) => {
  if (score > 20) return colors[0]
  if (score > 15) return colors[1]
  if (score > 10) return colors[2]
  if (score > 5) return colors[3]
  if (score > -5) return colors[4]
  if (score > -10) return colors[5]
  if (score > -15) return colors[6]
  if (score > -20) return colors[7]
  return colors[8];
}

export const changeTimeZone = (date) => {
  var offset = -5;
  return new Date( new Date(date).getTime() + offset * 3600 * 1000).toUTCString().replace( /GMT$/, "EST" )
};

export const getEspnAbbreviation = (teamName) => {
  if (teamName === 'NOP') return 'NO';
  if (teamName === 'UTA') return 'UTAH';
  return teamName;
};
