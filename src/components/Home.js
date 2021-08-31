import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { withAuth0 } from "@auth0/auth0-react";
import { Card, Container, Col, Row, Button } from "react-bootstrap";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCryptoData: [],
    };
  }

  componentDidMount = () => {
    const { user, isAuthenticated } = this.props.auth0;
    if (isAuthenticated) {
      let apiUrl = `${process.env.REACT_APP_BACKEND_URL}/retrieve`;
      axios.get(apiUrl).then((result) => {
        this.setState({
          allCryptoData: result.data,
        });
        console.log(result);
      });
    }
  };

  addToFav = (index) => {
    let data = {
      id: this.state.allCryptoData[index].id,
      title: this.state.allCryptoData[index].title,
      description: this.state.allCryptoData[index].description,
      toUSD: this.state.allCryptoData[index].toUSD,
      image_url: this.state.allCryptoData[index].image_url,
    };
    let email = this.props.auth0.user.email;
    let getUrl = `${process.env.REACT_APP_BACKEND_URL}/create/${email}`;
    axios.post(getUrl, data).then((result) => {
      console.log(result.data);
    });
  };

  render() {
    return (
      <>
        <h1>Crypto List</h1>
        <Container>
          <Row>
            {this.state.allCryptoData.length > 0 &&
              this.state.allCryptoData.map((element, index) => {
                return (
                  <Col>
                    <Card key={index} style={{ width: "18rem" }}>
                      <Card.Img variant="top" src={element.image_url} />
                      <Card.Body>
                        <Card.Title>{element.title}</Card.Title>
                        <Card.Text>{element.description}.</Card.Text>
                        <Card.Text>{element.toUSD}.</Card.Text>
                        <Button
                          onClick={() => this.addToFav(index)}
                          variant="primary"
                        >
                          add to my list
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Container>
      </>
    );
  }
}

export default withAuth0(Home);
