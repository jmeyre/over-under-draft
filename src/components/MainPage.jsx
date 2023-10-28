import { useEffect, useState } from "react";
import { ButtonGroup, Card, Col, Container, ListGroup, Row, Spinner, ToggleButton } from "react-bootstrap";
import { getBackgroundColor, changeTimeZone, getEspnAbbreviation } from "../functions/utilities";

const MainPage = () => {
  const [rowData, setRowData] = useState({});
  const [timestamp, setTimestamp] = useState('');
  const [sortMode, setSortMode] = useState('');

  const radios = [
    { name: 'Draft Order', value: '' },
    { name: 'Score', value: 'byScore' }
  ];

  useEffect(async () => {
    await fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        setRowData(data.data.data);
        setTimestamp(data.data.timestamp);
      });

    if (!Object.entries(rowData).length) {
      setTimeout(() => {
        fetch("/api")
          .then((res) => res.json())
          .then((data) => {
            setRowData(data.data.data);
            setTimestamp(data.data.timestamp);
          });
      }, 3000);
    }
  }, []);

  return (rowData && Object.entries(rowData).length) ? (
    <Container style={{ marginBottom: '24px' }}>
      <p>Last refresh: {changeTimeZone(timestamp)}</p>
      <div style={{ textAlign: 'right', margin: '16px 0px' }}>
        <b style={{ marginRight: '12px' }}>Sort by:</b>
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant="outline-primary"
              name="radio"
              value={radio.value}
              checked={sortMode === radio.value}
              onChange={(e) => setSortMode(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      <Row xs="1" sm="2" lg="3" xl="4" className="g-4">
        {Object.entries(rowData).sort((a, b) => (b[1].totalScore - a[1].totalScore)).map(value => (
          <Col key={value[0]}>
            <Card>
              <Card.Header>
                <b>{value[0]}</b>
                {value[0] === 'Marty' &&
                  <div>
                    <img alt="Bud Light Platinum" src="https://images.squarespace-cdn.com/content/v1/5e30be0936425a3e18218456/1581026266491-FSKK0PRPFTGA1Q6655KH/Bud+Light+Platinum.png" width="150" />
                    {/* <img alt="Bud Light Platinum" src="https://straubdistributing.com/wp-content/uploads/2015/06/BudLightPlatinum-1.png" width="150" /> */}
                  </div>
                }
              </Card.Header>
              <Card.Body>
                <Card.Title>{value[1].totalScore}</Card.Title>
                
              </Card.Body>
              <ListGroup variant="flush" style={{ textAlign: 'left' }}>
                {Object.values(value[1].rows).sort((a, b) => sortMode === 'byScore' ? b.score - a.score : 1).map(team => (
                  <ListGroup.Item key={value[0] + team.name + team.ou} style={{ backgroundColor: getBackgroundColor(team.score), padding: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {team.pos && <b style={{ marginRight: '16px' }}>{team.pos}</b>}
                        <img alt="Team Logo" src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${getEspnAbbreviation(team.name)}.png`} width="50" style={{ marginRight: '16px' }} />
                        <div>
                          <span><b>{team.name}</b> <font size="2.5">({team.wins}-{team.losses})</font></span>
                          <br />
                          Proj: {team.ou === 'over' ? `${team.line + team.score}-${82-(team.line + team.score)}` : `${team.line - team.score}-${82-(team.line - team.score)}`}
                          <br />
                          <b>{team.ou}</b> {team.line}
                        </div>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                          <b>{team.score > 0 ? `+${team.score}` : team.score}</b>
                      </span>
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>
      <footer className="page-footer font-small blue pt-4">
        <div className="footer-copyright text-center">GitHub:&nbsp;
          <a target="_blank" rel="noreferrer" href="https://github.com/jmeyre/over-under-draft/">github.com/jmeyre/over-under-draft</a>
        </div>
      </footer>
    </Container>
  ) : (
    <>
      <h1>Loading</h1>
      <Spinner animation="border" />
    </>
  )
}

export default MainPage;