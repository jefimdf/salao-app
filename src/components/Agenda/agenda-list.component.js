import axios from 'axios';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import DataGrid from '../../common/dataGrid/dataGrid';
import { serverDateToString } from "../../common/dateValidations";
import { formatMoney } from '../../common/functions';
import ModalConfirmacao from "../../common/modalConfirmacao";
import Persistencia from '../Administracao/Commom/persistencia';

const tableName = 'agenda';

export default function AgendaList(props) {

  const [data, setData] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [idRegistro, setIdRegistro] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [servicosFuncionarios, setServicosFuncionarios] = useState([]);
  const [carregado, setCarregado] = useState(false);
  const [precos, setPrecos] = useState([]);

  const persistencia = new Persistencia({ props: props, tableName: tableName, setShowModal: setShowModal });

  useEffect(() => {

    carregaLista();

  }, []);

  const carregaLista = () => {
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
  }

  const onDelete = (id) => {
    axios.delete(process.env.REACT_APP_URL_SERVER + tableName + '/delete/' + id)
      .then((res) => {
        debugger
        console.log('Excluído com sucesso!');
        setShowModal(false);
        carregaLista();
      }).catch((error) => {
        console.log(error)
      })
  }

  const confimarExclusao = (id) => {
    setShowModal(true)
    setIdRegistro(id);
  }

  const handleClose = (status) => {
    if (status) {
      onDelete(idRegistro);
    }
    setShowModal(status);
  }

  const novo = () => {
    props.history.push('/create-' + tableName + '');
  }

  const retornaServico = (id) => {
    return servicos.find(obj => obj._id === id).nome;
  }

  const retornaFuncionario = (id) => {
    return funcionarios.find(obj => obj._id === id).nome;
  }

  const retornaCliente = (id) => {
    return clientes.find(obj => obj._id === id) ? clientes.find(obj => obj._id === id).nome : '';
  }

  const handleEditar = (url) => {
    props.history.push(url);
  }

  const formatDateAAAAMMDD = (data) => {
    data = new Date(data);

    return data;

  }

  const DataTable = () => {


    let dataAtual = new Date();

    let dataInicial = formatDateAAAAMMDD(new Date(dataAtual.setDate(dataAtual.getDate() - 7)));

    let dataFinal = formatDateAAAAMMDD(new Date(dataAtual.setDate(dataAtual.getDate() + 30)));

    let agendaFiltro = [];

    agendas.map(obj => {

      if (formatDateAAAAMMDD(obj.data) >= dataInicial && formatDateAAAAMMDD(obj.data) <= dataFinal) {debugger
        agendaFiltro.push(
          {
            ...obj,
            servico: retornaServico(obj.idServico),
            funcionario: retornaFuncionario(obj.idFuncionario),
            cliente: retornaCliente(obj.idCliente),
            data: serverDateToString(obj.data),
            valor: formatMoney(obj.total, 'R$')
          }
        );
        
      }


    });

    if (agendaFiltro.length > 0) {
      
      return (
        <DataGrid
          {...props}
          fields={[{ field: "servico", filter: true, floatingFilter: true },
          { field: "funcionario", filter: true, floatingFilter: true },
          { field: "cliente", filter: true, floatingFilter: true },
          { field: "data", filter: true, floatingFilter: true },
          { field: "hora", filter: true, floatingFilter: true },
          { field: "valor", filter: true, floatingFilter: true },
          { field: "situacao", filter: true, floatingFilter: true }
          ]}
          data={agendaFiltro}
          tableName={tableName}
          edit={false}
          setShowModal={setShowModal}
          setIdRegistro={setIdRegistro}
        />
      )
    }


  }




  return (
    <div>
      <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de agenda" Message="Deseja excluir o registro?" />
      <Button variant="primary" size="lg" block="block" type="button" onClick={novo}>Novo</Button>
      {carregado && DataTable()}

    </div>

  );

}