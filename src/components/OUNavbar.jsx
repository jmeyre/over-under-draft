import { Container, Navbar } from "react-bootstrap";
import logo from '../nba.png';

const OUNavbar = () => (
  <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand>
        <img alt="NBA Logo" src={logo} width="50" height="50" />
        Buckets Over/Under Draft
      </Navbar.Brand>
    </Container>
  </Navbar>
)

export default OUNavbar;