import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

const tableName = 'usuario';
const nonce = '';

export default class EditUsuario extends Component {

  constructor(props) {
    super(props)

    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeSenhaAtual = this.onChangeSenhaAtual.bind(this);
    this.onChangeNovaSenha = this.onChangeNovaSenha.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // State
    this.state = {
      nome: '',
      email: '',
      senha: '',
      novaSenha: '',
      senhaAtual: ''
    }
  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/edit/' + this.props.match.params.id)
      .then(res => {
        this.setState({
          nome: res.data.nome,
          email: res.data.email,
          senha: res.data.senha
        });
      })
      .catch((error) => {
        console.log(error);
      })
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

  onChangeSenhaAtual(e) {
    this.setState({ senhaAtual: e.target.value })
  }

  onChangeNovaSenha(e) {
    this.setState({ novaSenha: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()

    const path='', privateKey='';

    if (this.state.senha == Base64.stringify(hmacSHA512(path + sha256(nonce + this.state.senhaAtual), privateKey))){

      const senha = Base64.stringify(hmacSHA512(path + sha256(nonce + this.state.novaSenha), privateKey));

      const objEnvio = {
        nome: this.state.nome,
        email: this.state.email,
        senha: senha
      };

      axios.put(process.env.REACT_APP_URL_SERVER + tableName + '/update/' + this.props.match.params.id, objEnvio)
        .then((res) => {
          console.log(res.data)
          console.log('Alterado com sucesso!')
        }).catch((error) => {
          console.log(error)
        })

      // Redirect to Student List 
      this.props.history.push('/'+tableName+'-list');
    }


  }


  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="Nome">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" value={this.state.nome} onChange={this.onChangeNome} />
        </Form.Group>

        <Form.Group controlId="Email">
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="email" value={this.state.email} onChange={this.onChangeEmail} />
        </Form.Group>

        <Form.Group controlId="SenhaAtual">
          <Form.Label>Senha Atual</Form.Label>
          <Form.Control type="password" onChange={this.onChangeSenhaAtual} />
        </Form.Group>

        <Form.Group controlId="NovaSenha">
          <Form.Label>Nova Senha</Form.Label>
          <Form.Control type="password" onChange={this.onChangeNovaSenha} />
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
