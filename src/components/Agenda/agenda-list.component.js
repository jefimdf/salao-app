import axios from 'axios';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { serverDateToString } from "../../common/dateValidations";
import ModalConfirmacao from "../../common/modalConfirmacao";

const tableName = 'agenda';

export default function AgendaList(props) {

  const [agendas, setAgendas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [idRegistro, setIdRegistro] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [servicosFuncionarios, setServicosFuncionarios] = useState([]);
  const [carregado, setCarregado] = useState(false);
  const [precos, setPrecos] = useState([]);

  useEffect(() => {
  
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
        
          setAgendas(objAgenda);
          setServicosFuncionarios(objServicoFuncionario);
          setServicos(objServico);
          setPrecos(objPreco);
          setFuncionarios(objFuncionario);
          setClientes(objCliente);
          setCarregado(true);

      }, (evt) => {
          console.log(evt);        
      })
    
  }, []);
  

  const onDelete = (id) => {
    axios.delete(process.env.REACT_APP_URL_SERVER + tableName + '/delete/' + id)
        .then((res) => {
            console.log('Excluído com sucesso!');
            setShowModal(false);    
            //carregaLista();
        }).catch((error) => {
            console.log(error)
        })    
  }

  const confimarExclusao = (id) =>{
    setShowModal(true) 
    setIdRegistro(id);
  }

  const handleClose = (status) =>{
    if (status){
      onDelete(idRegistro);
    }
    setShowModal(status);    
  }

  const novo = ()=>{
    props.history.push('/create-'+tableName+'');
  }

  const retornaServico = (id) =>{
    return servicos.find(obj=>obj._id===id).nome;
  }

  const retornaFuncionario = (id) =>{
    return funcionarios.find(obj=>obj._id===id).nome;
  }

  const retornaCliente = (id) =>{
    return clientes.find(obj=>obj._id===id) ? clientes.find(obj=>obj._id===id).nome : '';
  }

  const handleEditar = (url) =>{
    props.history.push(url);
  }

  const formatDateAAAAMMDD=(data)=>{
    data = new Date(data);

    return data;//parseInt(data.getUTCFullYear() + data.getMonth() + data.getDate());

  }

  const DataTable=() =>{
    

    let dataAtual = new Date();
    let diaAtual = dataAtual.getDate();

    let dataInicial = formatDateAAAAMMDD(new Date(dataAtual.setDate(diaAtual - 7)));

    let dataFinal= formatDateAAAAMMDD(new Date(dataAtual.setDate(diaAtual + 7)));

    let agendaFiltro = [];
    
    agendas.map(obj=>{
      
      if(formatDateAAAAMMDD(obj.data) >= dataInicial && formatDateAAAAMMDD(obj.data) <= dataFinal){
        agendaFiltro.push(obj);
      }
    });
    
    return agendaFiltro.map((res) => {
      
      return (
        <tr>
            <td>{retornaServico(res.idServico)}</td>
            <td>{retornaFuncionario(res.idFuncionario)}</td>
            <td>{retornaCliente(res.idCliente)}</td>
            <td>{serverDateToString(res.data)}</td>
            <td>{res.hora}</td>
            <td>{res.total}</td>
            <td>{res.situacao}</td>
            <td>
            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button type="button" className="btn btn-primary" onClick={() => handleEditar("/edit-"+tableName+"/" + res._id)}>
                    Editar
              </button>
              <button type="button" className="btn btn-danger" onClick={() => confimarExclusao(res._id)}>Excluir</button>
            </div>                
            </td>
        </tr>
      );

    });
  }


  
    
    return (
      <div>
        <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de preço" Message="Deseja excluir o registro?" />
        <div className="table-wrapper">        
        <Button variant="primary" size="lg" block="block" type="button" onClick={novo}>Novo</Button>        
        <table className="table table-striped">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Funcionário</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Valor</th>
                <th>Situação</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {carregado && DataTable()}
            </tbody>
          </table>          
        </div>
        
      </div>
    
    );
  
}