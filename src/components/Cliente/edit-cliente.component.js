import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MaskedFormControl from 'react-bootstrap-maskedinput';
import { serverDateToString } from "../../common/dateValidations";


const tableName = 'cliente';

export default class EditCliente extends Component {

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
      cidades: []
    }
  }

  componentDidMount() {
    this.carregaDados();
    this.carregaCidades();
    
  }

  carregaDados(){
    axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/edit/' + this.props.match.params.id)
      .then(res => {
        debugger
        this.setState({
          nome: res.data.nome,
          dataNasc: new Date(res.data.dataNascimento),
          celular: res.data.celular,
          idCidade: res.data.idCidade
        });
      })
      .catch((error) => {
        console.log(error);
      })
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
    e.preventDefault()

    const objEnvio = {
      nome: this.state.nome,
      dataNascimento: this.state.dataNasc,
      celular: this.state.celular,
      idCidade: this.state.idCidade,
    };

    axios.put(process.env.REACT_APP_URL_SERVER + tableName + '/update/' + this.props.match.params.id, objEnvio)
      .then((res) => {
        console.log(res.data)
        console.log('Alterado com sucesso!')
      }).catch((error) => {
        console.log(error)
      })

    // Redirect to Student List 
    this.props.history.push('/'+tableName+'-list')
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
        <Form.Group controlId="Name">
          <Form.Label>Celular</Form.Label>
          <MaskedFormControl type='text' name='celular' mask='(11)1111-1111' value={this.state.celular} onChange={this.onChangeCelular} />          
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
          <Col><Button variant="danger" size="lg" block="block" type="submit">
          Alterar
        </Button></Col>
          <Col><Button variant="warning" size="lg" block="block" type="button" onClick={this.cancelar}>Cancelar</Button></Col>          
        </Row>
      </Container>

      </Form>

    </div>);
  }
}
