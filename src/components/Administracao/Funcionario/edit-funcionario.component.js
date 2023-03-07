import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MaskedFormControl from 'react-bootstrap-maskedinput';

const tableName = 'funcionario';

export default class EditFuncionario extends Component {

  constructor(props) {
    super(props)

    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeDataNasc = this.onChangeDataNasc.bind(this);
    this.onChangeCpf = this.onChangeCpf.bind(this);
    this.onChangeRg = this.onChangeRg.bind(this);
    this.onChangeEndereco = this.onChangeEndereco.bind(this);
    this.onChangeCidade = this.onChangeCidade.bind(this);
    this.onChangeCelular = this.onChangeCelular.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // State
    this.state = {
      nome: '',
      email: '',
      dataNasc: '',
      cpf: '',
      rg: '',
      endereco: '',
      idCidade: '',
      celular: '',
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
        this.setState({
          nome: res.data.nome,
          email: res.data.email,
          dataNasc: new Date(res.data.dataNascimento),
          cpf: res.data.cpf,
          rg: res.data.rg,
          endereco: res.data.endereco,
          idCidade: res.data.idCidade,
          celular: res.data.celular,
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

  onChangeEmail(e) {
    this.setState({ email: e.target.value })
  }

  onChangeCpf(e) {
    this.setState({ cpf: e.target.value })
  }

  onChangeRg(e) {
    this.setState({ rg: e.target.value })
  }

  onChangeEndereco(e) {
    this.setState({ endereco: e.target.value })
  }

  onChangeCidade(e) {
    this.setState({ idCidade: e.target.value })
  }

  onChangeCelular(e) {
    this.setState({ celular: e.target.value })
  }

  onChangeDataNasc = (date) => {
    this.setState({ dataNasc: date })
  }

  onSubmit(e) {
    e.preventDefault()

    const objEnvio = {
      nome: this.state.nome,
      email: this.state.email,
      dataNascimento: this.state.dataNasc,
      cpf: this.state.cpf,
      rg: this.state.rg,
      endereco: this.state.endereco,
      idCidade: this.state.idCidade,
      celular: this.state.celular
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

        <Form.Group controlId="Email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={this.state.email} onChange={this.onChangeEmail} />
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

        <Form.Group controlId="Cpf">
          <Form.Label>CPF</Form.Label>
          <MaskedFormControl type='text' name='cpf' mask='111.111.111-11' value={this.state.cpf} onChange={this.onChangeCpf} />          
        </Form.Group>

        <Form.Group controlId="RG">
          <Form.Label>RG</Form.Label>
          <Form.Control type="text" value={this.state.rg} onChange={this.onChangeRg} />
        </Form.Group>

        <Form.Group controlId="Endereco">
          <Form.Label>Endereço</Form.Label>
          <Form.Control type="text" value={this.state.endereco} onChange={this.onChangeEndereco} />
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
              <button type="submit" className="btn btn-primary" >Alterar</button>
              <button type="button" className="btn btn-warning" onClick={this.cancelar}>Cancelar</button>
            </div>
          </Row>
      </Container>

      </Form>

    </div>);
  }
}
