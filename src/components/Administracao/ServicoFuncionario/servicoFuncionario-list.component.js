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
    
    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
      .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'funcionario/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
        .then(res => res = res.data)            
    ];

    Promise.all(requests)
      .then(([objServFuncionarios, objFuncionarios, objServicos]) => {
        this.setState({
          servicosFuncionarios: objServFuncionarios,
          funcionarios: objFuncionarios,
          servicos: objServicos
        });

      }, (evt) => {
          console.log(evt);        
      });

  }

  delete = (id) => {
    axios.delete(process.env.REACT_APP_URL_SERVER + tableName + '/delete/' + id)
        .then((res) => {
            console.log('Excluído com sucesso!');
            this.setState({showModal: false});    
            window.location.reload();
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
    return this.state.funcionarios.find(obj=>obj._id===id).nome;
  }

  retornaServico = (id) =>{
    return this.state.servicos.find(obj=>obj._id===id).nome;
  }

  handleEditar(url){
    this.props.history.push(url);
  }

  DataTable() {
    return this.state.servicosFuncionarios.map((res) => {
      return (
        <tr>
            <td>{this.retornaFuncionario(res.idFuncionario)}</td>
            <td>{this.retornaServico(res.idServico)}</td>
            <td>{res.percentual}</td>
            <td>
            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button type="button" className="btn btn-primary" onClick={() => this.handleEditar("/edit-"+tableName+"/" + res._id)}>
                    Editar
              </button>
              <button type="button" className="btn btn-danger" onClick={() => this.confimarExclusao(res._id)}>Excluir</button>
            </div>                
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
        <table className="table table-striped">
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Serviço</th>
                <th>Percentual</th>
                <th className="col-6">Ação</th>
              </tr>
            </thead>
            <tbody>
              {this.DataTable()}
            </tbody>
          </table>          
        </div>
        <Button variant="primary" size="lg" block="block" type="button" onClick={this.novo}>Novo</Button>        
      </div>
    
    );
  }
}