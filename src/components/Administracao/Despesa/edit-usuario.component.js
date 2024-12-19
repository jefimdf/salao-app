import axios from 'axios';
import Base64 from 'crypto-js/enc-base64';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import sha256 from 'crypto-js/sha256';
import React from "react";
import { Container, Row } from "react-bootstrap";
import Form from 'react-bootstrap/Form';

const tableName = 'usuario';
const nonce = '';

export default class EditUsuario extends React.Component {

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
