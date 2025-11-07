require('dotenv').config();
const { picksConst } = require('../constants/constants.js');
const {
  getProjectedWins,
  getTeamAbbreviation,
} = require('../functions/utilities.js');
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

const callApi = async () => {
  const { body: apiData, timestamp } = await getStandings();
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
      const projWins = getProjectedWins(
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
        score: team.ou === 'over' ? projWins - team.line : team.line - projWins,
      };
      drafterArray.push(row);
    });
    // combine all array rows
    card[element[0]].rows = drafterArray;

    // calculate and assign score
    let totalScore = 0;
    drafterArray.forEach((value) => {
      totalScore += value.score;
    });
    card[element[0]].totalScore = totalScore;
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
