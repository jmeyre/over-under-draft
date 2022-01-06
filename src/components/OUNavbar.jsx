import { Container, Navbar } from "react-bootstrap";

const OUNavbar = () => (
  <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand>
        <img alt="NBA Logo" src="http://a4.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fmisc_logos%2F500%2Fnba.png" width="50" height="50" />
        Buckets 2021-2022 Over/Under Draft Progress Board
      </Navbar.Brand>
    </Container>
  </Navbar>
)

export default OUNavbar;