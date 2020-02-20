import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import ModalConfirmacao from "../../common/modalConfirmacao";
import { serverDateToString } from "../../common/dateValidations";

const tableName = 'agenda';

export default class AgendaList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      agendas: [],
      showModal: false,
      idRegistro: 0,
      clientes: [],
      funcionarios: [],
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
      axios.get(process.env.REACT_APP_URL_SERVER + 'servicoFuncionario/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'preco/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'funcionario/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'cliente/')
        .then(res => res = res.data)
    ];

    Promise.all(requests)
      .then(([objAgenda, objServicoFuncionario, objServico, objPreco, objFuncionario, objCliente]) => {
        this.setState({
          agendas: objAgenda,
          servicosFuncionarios: objServicoFuncionario,
          servicos: objServico,
          precos: objPreco,
          funcionarios: objFuncionario,
          clientes: objCliente          
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

  retornaFuncionario = (id) =>{
    return this.state.funcionarios.find(obj=>obj._id===id).nome;
  }

  retornaCliente = (id) =>{
    return this.state.clientes.find(obj=>obj._id===id).nome;
  }

  DataTable() {
    return this.state.agendas.map((res) => {
      
      return (
        <tr>
            <td>{this.retornaServico(res.idServico)}</td>
            <td>{this.retornaFuncionario(res.idFuncionario)}</td>
            <td>{this.retornaCliente(res.idCliente)}</td>
            <td>{serverDateToString(res.data)}</td>
            <td>{res.hora}</td>
            <td>{res.total}</td>
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
        <ModalConfirmacao show={this.state.showModal} handleClose={this.handleClose} Title="Exclusão de preço" Message="Deseja excluir o registro?" />
        <div className="table-wrapper">        
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Funcionário</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Valor Total</th>
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