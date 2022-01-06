import { Container, Navbar } from "react-bootstrap";

const OUNavbar = () => (
  <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand>
        <img alt="NBA Logo" src="%PUBLIC_URL%/nba.png" width="50" height="50" />
        Buckets 2021-2022 Over/Under Draft Progress Board
      </Navbar.Brand>
    </Container>
  </Navbar>
)

export default OUNavbar;