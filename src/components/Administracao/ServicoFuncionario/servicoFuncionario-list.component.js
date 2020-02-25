import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ModalConfirmacao from "../../../common/modalConfirmacao";
import { serverDateToString } from "../../../common/dateValidations";

const tableName = 'servicoFuncionario';

export default class ServicoFuncionarioList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      funcionarios: [],
      showModal: false,
      idRegistro: 0,
      servicos: [],
      servicosFuncionarios: []
    };

    this.delete = this.delete.bind(this);
    this.confimarExclusao = this.confimarExclusao.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.novo = this.novo.bind(this);
  }

  componentDidMount() {
    this.carregaFuncionario();
    this.carregaServico();
    this.carregaLista();        
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

  carregaLista(){
    axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
      .then(res => {
        this.setState({
          servicosFuncionarios: res.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  delete = (id) => {
    axios.delete(process.env.REACT_APP_URL_SERVER + tableName + '/delete/' + id)
        .then((res) => {
            console.log('Excluído com sucesso!');
            this.setState({showModal: false});    
            this.carregaLista();
        }).catch((error) => {
            console.log(error)
        })    
  }

  confimarExclusao(id){
    this.setState({showModal: true, idRegistro: id});
  }

  handleClose(status){
    if (status){
      this.delete(this.state.idRegistro);
    }
    this.setState({showModal: status});    
  }

  novo(){
    this.props.history.push('/create-'+tableName+'');
  }

  retornaFuncionario = (id) =>{
    debugger
    return this.state.funcionarios.find(obj=>obj._id===id).nome;
  }

  retornaServico = (id) =>{
    return this.state.servicos.find(obj=>obj._id===id).nome;
  }

  DataTable() {
    return this.state.servicosFuncionarios.map((res) => {
      return (
        <tr>
            <td>{res._id}</td>
            <td>{this.retornaFuncionario(res.idFuncionario)}</td>
            <td>{this.retornaServico(res.idServico)}</td>
            <td>{res.percentual}</td>
            <td>
                <Link className="edit-link" to={"/edit-"+tableName+"/" + res._id}>
                    Editar
                </Link>
                <Button onClick={() => this.confimarExclusao(res._id)} size="sm" variant="danger">Excluir</Button>
            </td>
        </tr>
      );

    });
  }


  render() {
    
    return (
      <div>
        <ModalConfirmacao show={this.state.showModal} handleClose={this.handleClose} Title="Exclusão de serviço de funcionário" Message="Deseja excluir o registro?" />
        <div className="table-wrapper">        
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Funcionário</th>
                <th>Serviço</th>
                <th>Percentual</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {this.DataTable()}
            </tbody>
          </Table>          
        </div>
        <Button variant="primary" size="lg" block="block" type="button" onClick={this.novo}>Novo</Button>        
      </div>
    
    );
  }
}