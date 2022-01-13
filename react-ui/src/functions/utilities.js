export const getTeamAbbreviation = (name) => {
  if (name === 'Atlanta Hawks') return 'ATL'
  if (name === 'Brooklyn Nets') return 'BKN'
  if (name === 'Boston Celtics') return 'BOS'
  if (name === 'Charlotte Hornets') return 'CHA'
  if (name === 'Chicago Bulls') return 'CHI'
  if (name === 'Cleveland Cavaliers') return 'CLE'
  if (name === 'Dallas Mavericks') return 'DAL'
  if (name === 'Denver Nuggets') return 'DEN'
  if (name === 'Detroit Pistons') return 'DET'
  if (name === 'Golden State Warriors') return 'GSW'
  if (name === 'Houston Rockets') return 'HOU'
  if (name === 'Indiana Pacers') return 'IND'
  if (name === 'Los Angeles Clippers') return 'LAC'
  if (name === 'Los Angeles Lakers') return 'LAL'
  if (name === 'Memphis Grizzlies') return 'MEM'
  if (name === 'Miami Heat') return 'MIA'
  if (name === 'Milwaukee Bucks') return 'MIL'
  if (name === 'Minnesota Timberwolves') return 'MIN'
  if (name === 'New Orleans Pelicans') return 'NOP'
  if (name === 'New York Knicks') return 'NYK'
  if (name === 'Oklahoma City Thunder') return 'OKC'
  if (name === 'Orlando Magic') return 'ORL'
  if (name === 'Philadelphia 76ers') return 'PHI'
  if (name === 'Phoenix Suns') return 'PHX'
  if (name === 'Portland Trail Blazers') return 'POR'
  if (name === 'Sacramento Kings') return 'SAC'
  if (name === 'San Antonio Spurs') return 'SAS'
  if (name === 'Toronto Raptors') return 'TOR'
  if (name === 'Utah Jazz') return 'UTA'
  if (name === 'Washington Wizards') return 'WAS'
}

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
  var offset = -6;
  return new Date( new Date(date).getTime() + offset * 3600 * 1000).toUTCString().replace( /GMT$/, "CST" )
};
