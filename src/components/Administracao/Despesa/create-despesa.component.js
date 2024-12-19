import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import Persistencia from '../Commom/persistencia';

const tableName = 'despesa';
const nonce = '';

const comboCategoria = [
  { value: '1', label: 'Cosmético' },
  { value: '2', label: 'Energia' },
  { value: '3', label: 'Água' },
  { value: '4', label: 'Internet' },
  { value: '5', label: 'Diversos' },
]

const comboLancamento = [{ value: '1', label: 'Único' },
{ value: '2', label: 'Mensal' },
{ value: '3', label: 'Anual' },]

export default function CreateUsuario(props) {

  const [dados, setDados] = useState({});
  const [showModal, setShowModal] = useState(false)
  const [idRegistro, setIdRegistro] = useState(0)
  const [carregado, setCarregado] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState('')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState([])
  const [lancamento, setLancamento] = useState([])

  const persistencia = new Persistencia({ props: props, tableName: tableName, setShowModal: setShowModal });

  useEffect(() => {

    const requests = [
      axios.get(process.env.REACT_APP_URL_SERVER + 'categoria/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'lancamento/')
        .then(res => res = res.data)
    ]

    Promise.all(requests)
      .then(([objCategoria, objLancamento]) => {
        objCategoria = objCategoria.map(obj => {
          return {
            value: obj._id,
            label: obj.name
          }
        })
        setCategoria(objCategoria);

        objLancamento = objLancamento.map(obj => {
          return {
            value: obj._id,
            label: obj.name
          }
        })
        setLancamento(objLancamento);

      })

  }, [])

  const cancelar = () => {
    props.history.push('/' + tableName + '-list');
  }

  const onChangeTitulo = (e) => {
    setTitulo(e.target.value);
  }

  const onChangeDescricao = (e) => {
    setDescricao(e.target.value);
  }

  const onChangeData = (e) => {
    debugger
    setData(e);
  }

  const onComboCategoria = (e) => {
    setCategoria(e.value);
  }

  const onComboLancamento = (e) => {
    setLancamento(e.value);
  }

  const onChangeValor = (e) => {
    setValor(e.target.value);
  }


  const onSubmit = (e) => {
    e.preventDefault();

    setCarregado(false)

    const objEnvio = {
      titulo: titulo,
      descricao: descricao,
      data: data,
      categoria: categoria,
      lancamento: lancamento,
      valor: valor
    };

    axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
      .then(res => {
        console.log(res.data);
        props.history.push('/' + tableName + '-list');
      });

  }


  return (<div className="form-wrapper">
    <Form onSubmit={onSubmit}>
      <div className="row">
        <div className="col-8">
          <Form.Group controlId="Titulo">
            <Form.Label>Título</Form.Label>
            <Form.Control type="text" value={titulo} onChange={onChangeTitulo} />
          </Form.Group>
        </div>
        <div className="col-4">
          <Form.Group controlId="Valor">
            <Form.Label>Valor</Form.Label>
            <Form.Control type="text" value={valor} onChange={onChangeValor} placeholder="R$ 000,00" />
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-8">
          <Form.Group controlId="Descricao">
            <Form.Label>Descrição</Form.Label>
            <Form.Control type="text" value={descricao} onChange={onChangeDescricao} />
          </Form.Group>
        </div>
        <div className="col-4">
          <Form.Group controlId="Data">
            <Form.Label>Data</Form.Label>
            <div className="row">
              <div className="col">
                <DatePicker
                  name="data"
                  className="form-control"
                  /* minDate={new Date()} */
                  selected={data}
                  onChange={onChangeData}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-6">
          <Form.Group controlId="Categoria">
            <Form.Label>Categoria</Form.Label>
            <Select
              name="categoria"
              options={categoria}
              className="basic-multi-select"
              onChange={onComboCategoria}
              placeholder="Selecione..."
              classNamePrefix="select"
            />
          </Form.Group>

        </div>
        <div className="col-6">
          <Form.Group controlId="Lancamento">
            <Form.Label>Lançamento</Form.Label>
            <Select
              name="lancamento"
              options={lancamento}
              className="basic-multi-select"
              onChange={onComboLancamento}
              placeholder="Selecione..."
              classNamePrefix="select"
            />
          </Form.Group>
        </div>
      </div>


      <Container id="Botoes">
        <div className="row">
          <div className="btn-group" role="group" aria-label="Basic mixed styles example">
            <button type="submit" className="btn btn-primary" >Criar</button>
            <button type="button" className="btn btn-warning" onClick={cancelar}>Cancelar</button>
          </div>
        </div>
      </Container>


    </Form>
  </div>);

}
