import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const tableName = 'usuario';

export default class EditUsuario extends Component {

  constructor(props) {
    super(props)

    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeSenha = this.onChangeSenha.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // State
    this.state = {
      nome: '',
      email: '',
      senha: ''
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

  onChangeNome(e) {
    this.setState({ nome: e.target.value })
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value })
  }

  onChangeSenha(e) {
    this.setState({ senha: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()

    const objEnvio = {
      nome: this.state.nome,
      email: this.state.email,
      senha: this.state.senha
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

        <Form.Group controlId="Senha">
          <Form.Label>Senha</Form.Label>
          <Form.Control type="password" value={this.state.senha} onChange={this.onChangeSenha} />
        </Form.Group>

        <Button variant="danger" size="lg" block="block" type="submit">
          Alterar
        </Button>
      </Form>
    </div>);
  }
}
