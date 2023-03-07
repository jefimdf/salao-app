import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';

const tableName = 'servico';

export default class CreateServico extends Component {

  constructor(props) {
    super(props)

    // Setting up functions
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeGrupoServico = this.onChangeGrupoServico.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // Setting up state
    this.state = {
      idGrupoServico: '',
      nome: '',
      grupoServico: []
    }
  }

  componentDidMount(){
    this.carregaGrupoServico();    
  }

  carregaGrupoServico(){
    axios.get(process.env.REACT_APP_URL_SERVER + 'grupoServico/')
    .then(res => {
      this.setState({
        grupoServico: res.data
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  grupoServico(){
    return this.state.grupoServico.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
  }

  onChangeGrupoServico(e) {
    this.setState({ idGrupoServico: e.target.value })
  }

  cancelar(){
    this.props.history.push('/'+tableName+'-list');
  }

  onChangeNome(e) {
    this.setState({ nome: e.target.value })
  }


  onSubmit(e) {
    e.preventDefault();

    const objEnvio = {
      idGrupoServico: this.state.idGrupoServico,
      nome: this.state.nome
    };

    axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
      .then(res => {
        console.log(res.data); 
        this.props.history.push('/'+tableName+'-list');
      });

    this.setState({
      nome: ''
    });
  }

  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>

       <Form.Group controlId="GrupoServico">
          <Form.Label>Grupo</Form.Label>
          <Form.Control as="select" value={this.state.idGrupoServico} onChange={this.onChangeGrupoServico}>
            <option value="0">Selecione...</option>
            {this.grupoServico()}
          </Form.Control> 
        </Form.Group>

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
