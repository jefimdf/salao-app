import axios from 'axios';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import DataGrid from '../../../common/dataGrid/dataGrid';
import { serverDateToString } from '../../../common/dateValidations';
import { formatMoney } from '../../../common/functions';
import Loading from '../../../common/loading/loading';
import ModalConfirmacao from "../../../common/modalConfirmacao";
import Persistencia from '../Commom/persistencia';
import '../Despesa/style.css';

const tableName = 'despesa';

const mesValues = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
]

export default function DespesaList(props) {

  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [showModal, setShowModal] = useState(false)
  const [idRegistro, setIdRegistro] = useState(0)
  const [carregado, setCarregado] = useState(false)
  const [mes, setMes] = useState('')
  const [total, setTotal] = useState(0)

  const persistencia = new Persistencia({ props: props, tableName: tableName, setShowModal: setShowModal });

  useEffect(() => {
    const dataAtual = new Date();

    const mesAtual = (dataAtual.getMonth() + 1);

    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + tableName + '/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'categoria/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'lancamento/')
        .then(res => res = res.data)
    ];

    Promise.all(requests)
      .then(([objDespesas, objCategoria, objLancamento]) => {


        objDespesas = objDespesas.map(obj => {

          return {
            ...obj,
            dataFormatada: serverDateToString(obj.data),
            valorPuro: obj.valor,
            valor: formatMoney(obj.valor, 'R$'),
            categoria: objCategoria.find(o => o._id === obj.categoria).name,
            lancamento: objLancamento.find(o => o._id === obj.lancamento).name
          }
        })

        setData(objDespesas);

        setMes(mesValues.find(obj => obj.value === mesAtual))

        filterDespesas(mesAtual)


      })

  }, []);

  const filterDespesas = (valor) => {
    setTimeout(() => {
      let total = 0;
      const dadosFilter = data.filter((obj) => {
        let data = new Date(obj.data); debugger
        if ((data.getMonth() + 1) === valor) {
          total += parseFloat(obj.valorPuro);
          return obj;
        } else if (obj.lancamento === 'Mensal') {
          total += parseFloat(obj.valorPuro);
          return obj;
        }
      })

      setDataFilter(dadosFilter)
      setCarregado(true);

      setTotal(total);

    }, 2000);
  }

  const onChangeMes = (e) => {
    setCarregado(false);
    setDataFilter([])

    setMes(e)

    filterDespesas(e.value)

  }

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
    <div className="form-wrapper">
      <ModalConfirmacao show={showModal} handleClose={handleClose} Title="Exclusão de cliente" Message="Deseja excluir o registro?" />
      <div className="row">
        <div className="col-4">
          <Button variant="primary" size="lg" block="block" type="button" onClick={novo}>Novo</Button>
        </div>
        <div className="col-4">
          <Form.Group controlId="Mes">
            <Form.Label>Mês</Form.Label>
            <Select
              name="mes"
              options={mesValues}
              value={mes}
              className="basic-multi-select"
              onChange={onChangeMes}
              placeholder="Selecione..."
              classNamePrefix="select"
            />
          </Form.Group>
        </div>
        <div className="col-4 center v-center">
          <Form.Label>Total: {formatMoney(total, 'R$')}</Form.Label>
        </div>
      </div>

      <br></br>

      {!carregado && <Loading />}

      {dataFilter.length > 0 && <DataGrid
        {...props}
        fields={[{ field: "titulo", filter: true, floatingFilter: true },
        { field: "valor" },
        { field: "dataFormatada", filter: true, floatingFilter: true },
        { field: "categoria", filter: true, floatingFilter: true },
        { field: "lancamento", filter: true, floatingFilter: true },
        ]}
        data={dataFilter}
        edit={true}
        tableName={tableName}
        setShowModal={setShowModal}
        setIdRegistro={setIdRegistro}
      />}


      {dataFilter.length <= 0 && <div className="row">
        <div className="col-4"></div>
        <div className="col-4 center">
          Sem registros
        </div>
        <div className="col-4"></div>
      </div>}

    </div>

  );
}
