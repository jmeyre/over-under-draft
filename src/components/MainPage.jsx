import { useEffect, useState } from "react";
import { ButtonGroup, Card, Col, Container, ListGroup, Row, Spinner, ToggleButton } from "react-bootstrap";
import { getBackgroundColor, changeTimeZone, getEspnAbbreviation } from "../functions/utilities";

const MainPage = () => {
  const [rowData, setRowData] = useState({});
  const [timestamp, setTimestamp] = useState('');
  const [projMode, setProjMode] = useState('');

  const projRadios = [
    { name: 'BBall Ref', value: '' },
    { name: 'Simple Prorate', value: 'prorate' }
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
        <b style={{ marginRight: '12px' }}>Projected by:</b>
        <ButtonGroup>
          {projRadios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant="outline-primary"
              name="radio"
              value={radio.value}
              checked={projMode === radio.value}
              onChange={(e) => setProjMode(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      <Row xs="1" sm="2" lg="3" xl="4" className="g-4">
        {Object.entries(rowData).sort((a, b) => ((projMode === '' ? b[1].totalProjectedScore : b[1].totalProratedScore) - (projMode === '' ? a[1].totalProjectedScore : a[1].totalProratedScore))).map(value => (
          <Col key={value[0]}>
            <Card>
              <Card.Header>
                <b>{value[0]}</b>
              </Card.Header>
              <Card.Body>
                <Card.Title>{projMode === '' ? value[1].totalProjectedScore : value[1].totalProratedScore}</Card.Title>
              </Card.Body>
              <ListGroup variant="flush" style={{ textAlign: 'left' }}>
                {Object.values(value[1].rows).map(team => (
                  <ListGroup.Item key={value[0] + team.name + team.ou} style={{ backgroundColor: getBackgroundColor(projMode === '' ? team.projectedScore : team.proratedScore), padding: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {team.pos && <b style={{ marginRight: '16px' }}>{team.pos}</b>}
                        <img alt="Team Logo" src={`https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${getEspnAbbreviation(team.name)}.png`} width="50" style={{ marginRight: '16px' }} />
                        <div>
                          <span><b>{team.name}</b> <font size="2.5">({team.wins}-{team.losses})</font></span>
                          <br />
                          Proj: {team.ou === 'over' ? `${team.line + (projMode === '' ? team.projectedScore : team.proratedScore)}-${82-(team.line + (projMode === '' ? team.projectedScore : team.proratedScore))}` : `${team.line - (projMode === '' ? team.projectedScore : team.proratedScore)}-${82-(team.line - (projMode === '' ? team.projectedScore : team.proratedScore))}`}
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