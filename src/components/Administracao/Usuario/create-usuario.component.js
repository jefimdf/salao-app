import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';

const tableName = 'usuario';
const nonce = '';

export default class CreateUsuario extends Component {

  constructor(props) {
    super(props)

    // Setting up functions
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeSenha = this.onChangeSenha.bind(this);
    this.onChangeAdm = this.onChangeAdm.bind(this);    
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // Setting up state
    this.state = {
      nome: '',
      email: '',
      senha: '',
      adm: ''
    }
  }

  cancelar(){
    this.props.history.push('/usuario-list');
  }

  onChangeNome(e) {
    this.setState({ nome: e.target.value })
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value })
  }

  onChangeSenha(e) {
    this.setState({ senha: e.target.value })
  }

  onChangeAdm(e) {debugger
    this.setState({ adm: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault();

    const path='', privateKey='';

    const senha = Base64.stringify(hmacSHA512(path + sha256(nonce + this.state.senha), privateKey));

    const objEnvio = {
      nome: this.state.nome,
      email: this.state.email,
      senha: senha,
      adm: this.state.adm     
    };
debugger
    axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
      .then(res => {
        console.log(res.data); 
        this.props.history.push('/usuario-list');
      });

    this.setState({
      nome: '',
      email: '',
      senha: '',
      adm: ''
    });
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

        <Form.Group controlId="Senha">
          <Form.Label>Senha</Form.Label>
          <Form.Control type="password" value={this.state.senha} onChange={this.onChangeSenha} />
        </Form.Group>

        <Form.Group controlId="Administrador?">
          <div className="row">
        <Form.Label>Administrador?</Form.Label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="radioSim" value="S" onChange={this.onChangeAdm}/>
          <label class="form-check-label" for="radioSim">Sim</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="radioNao" value="N" onChange={this.onChangeAdm} checked/>
          <label class="form-check-label" for="radioNao">Não</label>
        </div>
        </Form.Group>

      <Container id="Botoes">
      <div className="row">
              <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button type="submit" className="btn btn-primary" >Criar</button>
              <button type="button" className="btn btn-warning" onClick={this.cancelar}>Cancelar</button>
            </div>
          </div>
      </Container>
        
        
      </Form>
    </div>);
  }
}
