import axios from 'axios';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import DataGrid from '../../../common/dataGrid/dataGrid';
import ModalConfirmacao from "../../../common/modalConfirmacao";
import Persistencia from '../Commom/persistencia';

const tableName = 'servicoFuncionario';

export default function ServicoFuncionarioList(props) {

  const [data, setData] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [idRegistro, setIdRegistro] = useState(0)
  const [carregado, setCarregado] = useState(false)

  const persistencia = new Persistencia({ props: props, tableName: tableName, setShowModal: setShowModal });

  useEffect(() => {

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
        objServFuncionarios = objServFuncionarios.map(obj => {
          const func = objFuncionarios.find(obj2 => obj2._id === obj.idFuncionario).nome;
          const servico = objServicos.find(obj2 => obj2._id === obj.idServico).nome;
          return { ...obj, funcionario: func, servico: servico }
        })

        setData(objServFuncionarios)
        setCarregado(true)

      }, (evt) => {
        console.log(evt);
      });

  }, []);

  const handleClose = (status) => {
    if (status) {
      persistencia.handleDelete(idRegistro);
    }
    setShowModal(status);
  }

  const novo = () => {
    props.history.push('/create-' + tableName + '');
  }

  return (
    <div>
      <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de serviço de funcionário" Message="Deseja excluir o registro?" />
      <Button variant="primary" size="lg" block="block" type="button" onClick={novo}>Novo</Button>
      {carregado && <DataGrid
        {...props}
        fields={[{ field: "funcionario", filter: true, floatingFilter: true }, { field: "servico", filter: true, floatingFilter: true }, { field: "percentual", filter: true, floatingFilter: true }]}
        data={data}
        edit={true}
        tableName={tableName}
        setShowModal={setShowModal}
        setIdRegistro={setIdRegistro}
      />}

    </div>

  );

}