import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ModalConfirmacao from "../../../common/modalConfirmacao";


const tableName = 'grupoServico';

export default class GrupoServicoList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      servicos: [],
      showModal: false,
      idRegistro: 0
    };

    this.delete = this.delete.bind(this);
    this.confimarExclusao = this.confimarExclusao.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.novo = this.novo.bind(this);
  }

  componentDidMount() {
    this.carregaLista();    
  }

  carregaLista(){
    axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
      .then(res => {
        this.setState({
          servicos: res.data
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
    this.props.history.push('/create-'+tableName);
  }

  handleEditar(url){
    this.props.history.push(url);
  }

  DataTable() {
    return this.state.servicos.map((res) => {
      
      return (
        <tr>
            <td>{res.nome}</td>
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
        <ModalConfirmacao show={this.state.showModal} handleClose={this.handleClose} Title="Exclusão de serviço" Message="Deseja excluir o registro?" />
        <Button variant="primary" size="lg" block="block" type="button" onClick={this.novo}>Novo</Button>        
        <div className="table-wrapper">        
        <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {this.DataTable()}
            </tbody>
          </table>          
        </div>
        
      </div>
    
    );
  }
}