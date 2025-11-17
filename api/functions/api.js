require('dotenv').config();
const { picksConst } = require('../constants/constants.js');
const {
  getProratedWins,
  getTeamAbbreviation,
} = require('../functions/utilities.js');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const getStandings = async () => {
  console.warn('RAPID API CALL');
  const timestamp = Date();
  const response = await fetch(
    'https://api-basketball.p.rapidapi.com/standings?league=12&season=2025-2026',
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_API_KEY,
      },
    }
  );
  const body = await response.json();
  return { body, timestamp };
};

const getBballRefProjections = async () => {
  const response = await fetch('https://www.basketball-reference.com/friv/playoff_prob.html');
  const html = await response.text();
  const $ = cheerio.load(html);
  const results = [];

  // Eastern Conference
  $('#projected_standings_e tbody tr').each((_, row) => {
    const team = $(row).find('td[data-stat="team_name"] a').text().trim();
    const wins = $(row).find('td[data-stat="wins_avg"]').text().trim();
    const losses = $(row).find('td[data-stat="losses_avg"]').text().trim();
    if (team && wins && losses) {
      results.push({
        team: getTeamAbbreviation(team),
        projWins: Math.round(Number(wins)),
        projLosses: Math.round(Number(losses)),
      });
    }
  });

  // Western Conference
  $('#projected_standings_w tbody tr').each((_, row) => {
    const team = $(row).find('td[data-stat="team_name"] a').text().trim();
    const wins = $(row).find('td[data-stat="wins_avg"]').text().trim();
    const losses = $(row).find('td[data-stat="losses_avg"]').text().trim();
    if (team && wins && losses) {
      results.push({
        team: getTeamAbbreviation(team),
        projWins: Math.round(Number(wins)),
        projLosses: Math.round(Number(losses)),
      });
    }
  });

  return results;
};

const callApi = async () => {
  const { body: apiData, timestamp } = await getStandings();
  const bballRefProjections = await getBballRefProjections();
  if (apiData?.message) {
    console.warn(apiData.message);
    return;
  }
  const fetchData = apiData.response[0];
  let card = {
    Zeus: { rows: [], totalScore: 0 },
    Chris: { rows: [], totalScore: 0 },
    Adam: { rows: [], totalScore: 0 },
    Billy: { rows: [], totalScore: 0 },
    Amir: { rows: [], totalScore: 0 },
    Jesse: { rows: [], totalScore: 0 },
    Marty: { rows: [], totalScore: 0 },
    Leftovers: { rows: [], totalScore: 0 },
  };
  Object.entries(picksConst).forEach((element) => {
    const drafterArray = [];
    element[1].forEach((team) => {
      const standing =
        fetchData.find(
          (value) => team.team === getTeamAbbreviation(value.team.name)
        ) ?? {};
      const proratedWins = getProratedWins(
        standing.games.win.total,
        standing.games.lose.total
      );
      const row = {
        logo: standing.team.logo,
        name: team.team,
        ou: team.ou,
        line: team.line,
        pos: team.pos,
        wins: standing.games.win.total,
        losses: standing.games.lose.total,
        projWins: bballRefProjections.find(p => p.team === team.team)?.projWins || 0,
        projLosses: bballRefProjections.find(p => p.team === team.team)?.projLosses || 0,
        proratedScore: team.ou === 'over' ? proratedWins - team.line : team.line - proratedWins,
        projectedScore: team.ou === 'over' ? (bballRefProjections.find(p => p.team === team.team)?.projWins || 0) - team.line : team.line - (bballRefProjections.find(p => p.team === team.team)?.projWins || 0),
      };
      drafterArray.push(row);
    });
    // combine all array rows
    card[element[0]].rows = drafterArray;

    // calculate and assign score
    let totalProratedScore = 0;
    let totalProjectedScore = 0;
    drafterArray.forEach((value) => {
      totalProratedScore += value.proratedScore;
      totalProjectedScore += value.projectedScore;
    });
    card[element[0]].totalProratedScore = totalProratedScore;
    card[element[0]].totalProjectedScore = totalProjectedScore;
  });
  return { card, timestamp };
};

let data;
let timestamp;

exports.getData = () => {
  return { data, timestamp };
};

exports.apiCaller = () => {
  callApi().then((value) => {
    if (value.card && Object.entries(value.card)?.length) {
      data = value.card;
      timestamp = value.timestamp;
    }
  });
  // 30 minutes
  const handle = setInterval(callApi, 3600000);
  return () => clearInterval(handle);
};
