import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { withAuth0 } from "@auth0/auth0-react";
import { Card, Container, Col, Row, Button } from "react-bootstrap";

class FavCrypto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favData: [],
      index: 0,
      infoModal: [],
      show: false,
    };
  }

  componentDidMount = async () => {
    const { user, isAuthenticated } = this.props.auth0;
    if (isAuthenticated) {
      let email = this.props.auth0.user.email;
      let favUrl = `${process.env.REACT_APP_BACKEND_URL}/fav-list/${email}`;
      await axios.get(favUrl).then((result) => {
        this.setState({
          favData: result.data,
        });
        console.log(result);
        console.log(this.favData);
      });
    }
  };

  deleteFav = async (index) => {
    let id = this.state.favData[index]._id;
    let email = this.props.auth0.user.email;
    let deleteUrl = `${process.env.REACT_APP_BACKEND_URL}/delete/${email}/${id}`;
    await axios.delete(deleteUrl).then((result) => {
      console.log(result.data);
    });
    this.componentDidMount();
    this.forceUpdate();
  };

  handleShow = (index) => {
    this.setState({
      show: true,
      infoModal: this.state.favData[index],
      index: index,
    });
  };

  handleUpdate = async (e) => {
    e.preventDefault();
    let id = this.state.favData[this.state.index]._id;
    let email = this.props.auth0.user.email;
    let data = {
      id: e.target.id.value,
      title: e.target.title.value,
      description: e.target.description.value,
      toUSD: e.target.toUSD.value,
      image_url: e.target.image_url.value,
    };
    let updateUrl=`${process.env.REACT_APP_BACKEND_URL}/update/${email}/${id}`
    await axios.put(updateUrl,data).then(result=>{
      favData:result.data
    })
  };
  render() {
    return (
      <>
        <h1>Fav Crypto List</h1>
        <Container>
          <Row>
            {this.state.favData.length > 0 &&
              this.state.favData.map((element, index) => {
                return (
                  <Col>
                    <Card key={index} style={{ width: "18rem" }}>
                      <Card.Img variant="top" src={element.image_url} />
                      <Card.Body>
                        <Card.Title>{element.title}</Card.Title>
                        <Card.Text>{element.description}.</Card.Text>
                        <Card.Text>{element.toUSD}.</Card.Text>
                        <Button
                          onClick={() => this.deleteFav(index)}
                          variant="danger"
                        >
                          add to my list
                        </Button>
                        <Button
                          onClick={() => this.handleShow(index)}
                          variant="success"
                        >
                          update
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

export default FavCrypto;
