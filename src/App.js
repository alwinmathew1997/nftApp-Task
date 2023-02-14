import './App.css';
import {Container,Navbar,Button} from 'react-bootstrap/';



function App() {
  return (
    <>
       <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand >NFTs</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {/* Signed in as: <a href="#login">Mark Otto</a> */}
            <Button variant="warning">Warning</Button>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
}

export default App;
