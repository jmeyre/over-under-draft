import { useEffect, useState } from "react";
import { Card, Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import { getTeamAbbreviation, getBackgroundColor } from "../functions/utilities";

const MainPage = () => {
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        console.log('row data', data);
        setRowData(data.data);
      });
  }, []);

  return Object.entries(rowData).length ? (
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
    <>
      <h1>Loading</h1>
      <Spinner animation="border" />
    </>
  )
}

export default MainPage;