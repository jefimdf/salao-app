import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ModalConfirmacao from "../../common/modalConfirmacao";
import { serverDateToString } from "../../common/dateValidations";


const tableName = 'cliente';

export default class ClienteList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      clientes: [],
      showModal: false,
      idRegistro: 0,
      cidades: []
    };

    this.delete = this.delete.bind(this);
    this.confimarExclusao = this.confimarExclusao.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.novo = this.novo.bind(this);
  }

  componentDidMount() {
    this.carregaCidades();
    this.carregaLista();    
  }

  carregaCidades(){
    axios.get(process.env.REACT_APP_URL_SERVER + 'cidade/')
    .then(res => {
      this.setState({
        cidades: res.data
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
          clientes: res.data
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

  retornaCidade = (id) =>{
    return this.state.cidades.find(obj=>obj._id===id).nome;
  }

  DataTable() {
    return this.state.clientes.map((res) => {
      
      return (
        <tr>
            <td>{res._id}</td>
            <td>{res.nome}</td>
            <td>{serverDateToString(res.dataNascimento)}</td>
            <td>{res.celular}</td>
            <td>{this.retornaCidade(res.idCidade)}</td>
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
        <ModalConfirmacao show={this.state.showModal} handleClose={this.handleClose} Title="Exclusão de cliente" Message="Deseja excluir o registro?" />
        <div className="table-wrapper">        
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Data de Nascimento</th>
                <th>Celular</th>
                <th>Cidade</th>
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