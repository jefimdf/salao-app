import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";

const tableName = 'servicoFuncionario';

export default class EditServicoFuncionario extends Component {

  constructor(props) {
    super(props)

    this.onChangeServico = this.onChangeServico.bind(this);
    this.onChangeFuncionario = this.onChangeFuncionario.bind(this);
    this.onChangePercentual = this.onChangePercentual.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelar = this.cancelar.bind(this);

    // State
    this.state = {
      idServico: '',
      percentual: '',
      idFuncionario: '',
      servicos: [],
      funcionarios: []
    }
  }

  componentDidMount() {
    this.carregaFuncionario();
    this.carregaServico();
    this.carregaDados();
  }

  carregaFuncionario(){
    axios.get(process.env.REACT_APP_URL_SERVER + 'funcionario/')
    .then(res => {
      this.setState({
        funcionarios: res.data
      });
    })
    .catch((error) => {
      console.log(error);
    })
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
          idFuncionario: res.data.idFuncionario,
          idServico: res.data.idServico,
          percentual: res.data.percentual
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  cancelar(){
    this.props.history.push('/'+tableName+'-list');
  }

  onChangeFuncionario(e) {
    this.setState({ idFuncionario: e.target.value })
  }

  onChangeServico(e) {
    this.setState({ idServico: e.target.value })
  }

  onChangePercentual(e) {
    this.setState({ percentual: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()

    const objEnvio = {
      idFuncionario: this.state.idFuncionario,
      idServico: this.state.idServico,
      percentual: this.state.percentual
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

  funcionarios(){
    return this.state.funcionarios.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
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
        
        <Form.Group controlId="Funcionario">
          <Form.Label>Funcionários</Form.Label>
          <Form.Control as="select" value={this.state.idFuncionario} onChange={this.onChangeFuncionario}>
            <option value="0">Selecione...</option>
            {this.funcionarios()}
          </Form.Control> 
        </Form.Group>

        <Form.Group controlId="Servico">
          <Form.Label>Serviços</Form.Label>
          <Form.Control as="select" value={this.state.idServico} onChange={this.onChangeServico}>
            <option value="0">Selecione...</option>
            {this.servicos()}
          </Form.Control> 
        </Form.Group>

        <Form.Group controlId="Percentual">
          <Form.Label>Percentual</Form.Label>          
          <Form.Control type="text" value={this.state.percentual} onChange={this.onChangePercentual} placeholder="00.00 %"/>
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
