import { useEffect, useState } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { picksConst } from "../constants/constants";
import { getStandings } from "../functions/api";
import { getProjectedWins, getTeamAbbreviation, getBackgroundColor } from "../functions/utilities";

// interface TeamRow {
//   logo: string;
//   name: string;
//   ou: string;
//   line: number;
//   wins: number;
//   losses: number;
//   score: number;
// };

// interface Cards {
//   [key: string]: {
//       rows: TeamRow[];
//       totalScore: number;
//   };
// };

const MainPage = () => {
  const picks = picksConst;
  const [standings, setStandings] = useState([]);
  const [rowData, setRowData] = useState({});

  const callApi = async () => {
    const apiData = await getStandings();
    if (apiData.errors.length || apiData.response.length === 0) {
      console.warn('Error fetching NBA standings data.');
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
    Object.entries(picks).forEach(element => {
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
    setStandings(fetchData);
    setRowData(card);
  };

  useEffect(() => {
    callApi();
    const handle = setInterval(callApi, 3600000)
    // const handle = setInterval(callApi, 1200000) UNCOMMENT AFTER 11/10
    return () => clearInterval(handle);
  }, [])

  return standings.length ? (
    <Container>
      <Row xs="1" sm="2" lg="3" xl="4" className="g-4">
        {Object.entries(rowData).sort((a, b) => (b[1].totalScore - a[1].totalScore)).map(value => (
          <Col>
            <Card>
              <Card.Header><b>{value[0]}</b></Card.Header>
              <Card.Body>
                <Card.Title>{value[1].totalScore}</Card.Title>
              </Card.Body>
              <ListGroup variant="flush" style={{ textAlign: 'left' }}>
                {Object.values(value[1].rows).map(team => (
                  <ListGroup.Item style={{ backgroundColor: getBackgroundColor(team.score) }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <img alt="Team Logo" src={team.logo} width="50" style={{ marginRight: '6px' }} />
                        <div>
                          <b>{getTeamAbbreviation(team.name)}</b> {team.ou} {team.line}
                          <br />
                          W: {team.wins} L: {team.losses}
                          <br />
                          Proj. wins: {team.ou === 'over' ? team.line + team.score : team.line - team.score}
                        </div>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                          <b>{team.score}</b>
                      </span>
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  ) : (
    <></>
  )
}

export default MainPage;