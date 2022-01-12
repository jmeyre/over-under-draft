require('dotenv').config();
const { picksConst } = require( "../constants/constants.js");
const { getProjectedWins } = require('../functions/utilities.js');
const fetch = require("node-fetch");

const getStandings = async () => {
  console.warn('RAPID API CALL');
  const response = await fetch("https://api-basketball.p.rapidapi.com/standings?league=12&season=2021-2022", {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "api-basketball.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPID_API_KEY
    }
  });
  const body = await response.json();
  return body;
}

const callApi = async () => {
  const apiData = await getStandings();
  if (apiData?.message) {
    console.warn(apiData.message);
    return;
  }
  const fetchData = apiData.response[0];
  let card = {
    'Zeus': {rows: [], totalScore: 0},
    'Chris': {rows: [], totalScore: 0},
    'Adam': {rows: [], totalScore: 0},
    'Billy': {rows: [], totalScore: 0},
    'Amir': {rows: [], totalScore: 0},
    'Jesse': {rows: [], totalScore: 0},
    'Martin': {rows: [], totalScore: 0},
    'Leftovers': {rows: [], totalScore: 0},
  };
  Object.entries(picksConst).forEach(element => {
    const drafterArray = [];
    element[1].forEach(team => {
      const standing = fetchData.find((value) => team.team === value.team.name) ?? {};
      const projWins = getProjectedWins(standing.games.win.total, standing.games.lose.total);
      const row = {
        logo: standing.team.logo,
        name: team.team,
        ou: team.ou,
        line: team.line,
        wins: standing.games.win.total,
        losses: standing.games.lose.total,
        score: team.ou === 'over' ? projWins - team.line : team.line - projWins
      };
      drafterArray.push(row);
    })
    // combine all array rows
    card[element[0]].rows = drafterArray;

    // calculate and assign score
    let totalScore = 0;
    drafterArray.forEach(value => {
      totalScore += value.score;
    })
    card[element[0]].totalScore = totalScore;
  });
  return card;
};

let data;

exports.getData = () => {
  return data;
};

exports.apiCaller = () => {
  callApi().then((value) => {
    if (value && Object.entries(value)?.length) {
      data = value;
    }
  });
  // 30 minutes
  const handle = setInterval(callApi, 1800000);
  return () => clearInterval(handle);
};