import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";

const tableName = 'preco';

export default class EditPreco extends Component {

  constructor(props) {
    super(props)

    this.onChangeServico = this.onChangeServico.bind(this);
    this.onChangePreco = this.onChangePreco.bind(this);
    this.onChangeData = this.onChangeData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // State
    this.state = {
      idServico: '',
      preco: '',
      data: '',
      servicos: []
    }
  }

  componentDidMount() {
    this.carregaServico();
    this.carregaDados();
  }

  carregaServico(){
    axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
    .then(res => {
      this.setState({
        servicos: res.data
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  carregaDados(){
    axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/edit/' + this.props.match.params.id)
      .then(res => {
        this.setState({
          idServico: res.data.idServico,
          preco: res.data.preco,
          data: new Date(res.data.data)
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  cancelar(){
    this.props.history.push('/'+tableName+'-list');
  }

  onChangeServico(e) {
    this.setState({ idServico: e.target.value })
  }

  onChangePreco(e) {
    this.setState({ preco: e.target.value })
  }

  onChangeData = (date) => {
    this.setState({ data: date })
  }

  onSubmit(e) {
    e.preventDefault()

    const objEnvio = {
      idServico: this.state.idServico,
      preco: this.state.preco,
      data: this.state.data  
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

  servicos(){
    return this.state.servicos.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
  }

  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
      <Form.Group controlId="Servico">
          <Form.Label>Serviços</Form.Label>
          <Form.Control as="select" value={this.state.idServico} onChange={this.onChangeServico}>
            <option value="0">Selecione...</option>
            {this.servicos()}
          </Form.Control> 
        </Form.Group>

        <Form.Group controlId="data">
          <Form.Label for="datac">Data</Form.Label>          
        </Form.Group>
        <DatePicker
            name="data"
            className="form-control"
            minDate={new Date()}
            selected={this.state.data}
            onChange={this.onChangeData}
            dateFormat="dd/MM/yyyy"            
          />

        <Form.Group controlId="Preco">
          <Form.Label>Preço</Form.Label>          
          <Form.Control type="text" value={this.state.preco} onChange={this.onChangePreco} placeholder="R$ 000,00"/>
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
