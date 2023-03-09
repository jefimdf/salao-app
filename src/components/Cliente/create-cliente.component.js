import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MaskedFormControl from 'react-bootstrap-maskedinput'

import "react-datepicker/dist/react-datepicker.css";


const tableName = 'cliente';

export default class CreateCliente extends Component {

  constructor(props) {
    super(props)

    // Setting up functions
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeDataNasc = this.onChangeDataNasc.bind(this);
    this.onChangeCelular = this.onChangeCelular.bind(this);
    this.onChangeCidade = this.onChangeCidade.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // Setting up state
    this.state = {
      nome: '',
      dataNasc: '',
      celular: '',
      idCidade: '',
      startDate: new Date(),
      cidades: []
    }
  }

  componentDidMount(){
    this.carregaCidades();
  }

  carregaCidades(){
    axios.get(process.env.REACT_APP_URL_SERVER + 'cidade/')
    .then(res => {
      debugger
      this.setState({
        cidades: res.data
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  cancelar(){
    this.props.history.push('/'+tableName+'-list');
  }

  onChangeNome(e) {
    this.setState({ nome: e.target.value })
  }
  onChangeDataNasc = date => {
    this.setState({ dataNasc: date })
  }
  onChangeCelular(e) {
    this.setState({ celular: e.target.value })
  }
  onChangeCidade(e) {
    this.setState({ idCidade: e.target.value })
  }


  onSubmit(e) {
    e.preventDefault();

    const objEnvio = {
      nome: this.state.nome,
      dataNascimento: this.state.dataNasc,
      celular: this.state.celular,
      idCidade: this.state.idCidade,
    };

    axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
      .then(res => {
        console.log(res.data); 
        this.props.history.push('/'+tableName+'-list');
      });

    this.setState({
      nome: '',
      dataNasc: '',
      celular: '',
      idCidade: ''
    });
  }

  cidades(){
    return this.state.cidades.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
  }

  render() {

    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="Name">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" value={this.state.nome} onChange={this.onChangeNome} />
        </Form.Group>
        <Form.Group controlId="dtNasc">
          <Form.Label for="dtNasc">Data de Nascimento</Form.Label>          
        </Form.Group>
        <DatePicker
            name="dtNasc"
            className="form-control"
            selected={this.state.dataNasc}
            onChange={this.onChangeDataNasc}
            dateFormat="dd/MM/yyyy"            
          />
        <Form.Group controlId="Celular">
          <Form.Label>Celular</Form.Label>
          <MaskedFormControl type='text' name='celular' mask='(11)9 1111-1111' value={this.state.celular} onChange={this.onChangeCelular} />          
        </Form.Group>
        <Form.Group controlId="Cidade">
          <Form.Label>Cidade</Form.Label>
          <Form.Control as="select" value={this.state.idCidade} onChange={this.onChangeCidade}>
            <option value="0">Selecione...</option>
            {this.cidades()}
          </Form.Control> 
        </Form.Group>

        <Container id="Botoes">
          <Row>
              <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button type="submit" size="lg" className="btn btn-primary" >Criar</button>
              <button type="button" size="lg" className="btn btn-warning" onClick={this.cancelar}>Cancelar</button>
            </div>
          </Row>
        </Container>
        
        
      </Form>
    </div>);
  }
}
