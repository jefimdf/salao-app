import axios from 'axios';
import React, { useEffect, useState } from "react";
import DataGrid from '../../../common/dataGrid/dataGrid';
import ModalConfirmacao from "../../../common/modalConfirmacao";

const tableName = 'servico';

export default function ServicoList(props) {

  const [servicos, setServicos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [idRegistro, setIdRegistro] = useState(0)
  const [data, setData] = useState({})
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'grupoServico/')
        .then(res => res = res.data)
    ];

    Promise.all(requests)
      .then(([objServico, objGrupo]) => {
        objServico = objServico.map(obj => {
          return { ...obj, grupo: objGrupo.find(obj2 => obj2._id === obj.idGrupoServico)?.nome }
        })
        setData(objServico)
        setCarregado(true);
      }, (evt) => {
        console.log(evt);
      })
  }, []);



  const handleDelete = (id) => {
    axios.delete(process.env.REACT_APP_URL_SERVER + tableName + '/delete/' + id)
      .then((res) => {
        console.log('Excluído com sucesso!');
        setShowModal(false)
        window.location.reload()
      }).catch((error) => {
        console.log(error)
      })
  }

  const handleClose = (status) => {
    if (status) {
      handleDelete(idRegistro);
    }
    setShowModal(status)
  }

  const novo = () => {
    props.history.push('/create-' + tableName);
  }

  return (
    <div>
      <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de serviço" Message="Deseja excluir o registro?" />
      <button type="button" className="btn btn-primary" onClick={novo}>Novo</button>
      {carregado && <DataGrid
        {...props}
        fields={[{ field: "grupo", filter: true, floatingFilter: true }, { field: "nome", filter: true, floatingFilter: true }]}
        data={data}
        edit={true}
        tableName={tableName}
        setShowModal={setShowModal}
        setIdRegistro={setIdRegistro}
      />}

    </div>

  );

}