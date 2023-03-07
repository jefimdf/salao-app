import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ModalConfirmacao from "../../../common/modalConfirmacao";
import { serverDateToString } from "../../../common/dateValidations";

const tableName = 'preco';

export default class PrecoList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      precos: [],
      showModal: false,
      idRegistro: 0,
      servicos: []
    };

    this.delete = this.delete.bind(this);
    this.confimarExclusao = this.confimarExclusao.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.novo = this.novo.bind(this);
  }

  componentDidMount() {
    this.carregaServico();
    this.carregaLista();        
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
      .then(res => {debugger
        this.setState({
          precos: res.data
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

  retornaServico = (id) =>{
    return this.state.servicos.find(obj=>obj._id===id).nome;
  }

  handleEditar(url){
    this.props.history.push(url);
  }

  DataTable() {
    return this.state.precos.map((res) => {
      debugger
      return (
        <tr>
            <td>{this.retornaServico(res.idServico)}</td>
            <td>{res.preco}</td>
            <td>{serverDateToString(res.data)}</td>
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
        <ModalConfirmacao show={this.state.showModal} handleClose={this.handleClose} Title="Exclusão de preço" Message="Deseja excluir o registro?" />
        <div className="table-wrapper">        
        <table className="table table-striped">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Preço</th>
                <th>Data</th>
                <th>Ação</th>
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