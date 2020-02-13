import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap/lib/Tab";
import {Row, Col} from 'react-bootstrap';

const tableName = 'cidade';
const nonce = '';

export default class CreateCidade extends Component {

  constructor(props) {
    super(props)

    // Setting up functions
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // Setting up state
    this.state = {
      nome: ''
    }
  }

  cancelar(){
    this.props.history.push('/cidade-list');
  }

  onChangeNome(e) {
    this.setState({ nome: e.target.value })
  }


  onSubmit(e) {
    e.preventDefault();

    const path='', privateKey='';

    const objEnvio = {
      nome: this.state.nome
    };

    axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
      .then(res => {
        console.log(res.data); 
        this.props.history.push('/cidade-list');
      });

    this.setState({
      nome: ''
    });
  }

  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="Name">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" value={this.state.nome} onChange={this.onChangeNome} />
        </Form.Group>

      <Container id="Botoes">
        <Row>
          <Col><Button variant="danger" size="lg" block="block" type="submit">Criar</Button></Col>
          <Col><Button variant="warning" size="lg" block="block" type="button" onClick={this.cancelar}>Cancelar</Button></Col>          
        </Row>
      </Container>
        
        
      </Form>
    </div>);
  }
}
