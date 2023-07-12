import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';

const tableName = 'servico';

export default class EditServico extends Component {

  constructor(props) {
    super(props)

    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeQuantidadeHoras =  this.onChangeQuantidadeHoras.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // State
    this.state = {
      nome: '',
      quantidadeHoras: 0
    }
  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/edit/' + this.props.match.params.id)
      .then(res => {
        this.setState({
          nome: res.data.nome,
          quantidadeHoras: res.data.quantidadeHoras
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

  onChangeQuantidadeHoras(e) {
    this.setState({ quantidadeHoras: e.target.value })
  }

 

  onSubmit(e) {
    e.preventDefault()

    const objEnvio = {
      nome: this.state.nome,
      quantidadeHoras: this.state.quantidadeHoras
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

        <Form.Group controlId="QuantidadeHoras">
          <Form.Label>Quantidade Horas</Form.Label>          
          <Form.Control type="text" value={this.state.quantidadeHoras} onChange={this.onChangeQuantidadeHoras} placeholder="00"/>
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
