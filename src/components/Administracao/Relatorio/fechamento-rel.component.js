import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import Mensagem from "../../../common/mensagem/Mensagem";
import DatePicker from "react-datepicker";
import MaskedFormControl from "react-bootstrap-maskedinput";
import {
  serverDateToString,
  dateToStringAmericano,
} from "../../../common/dateValidations";
import ordenacao from "../../../common/ordenacao";
import "./style.css";

export default function FechamentoMes(props) {
  const [userLogado] = useState(
    window.sessionStorage.getItem("userLogado")
      ? window.sessionStorage.getItem("userLogado")
      : false
  );
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [mensagem, setMensagem] = useState({});
  const [funcionarios, setFuncionarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [servicosFuncionarios, setServicosFuncionarios] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState([]);
  const [gruposServicos, setGruposServicos] = useState([]);
  const [horarios, setHorarios] = useState(
    process.env.REACT_APP_HORARIOS.split(",")
  );
  const [carregado, setCarregado] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [precos, setPrecos] = useState([]);
  const [listaRelatorio, setListaRelatorio] = useState([]);

  useEffect(() => {
    const requests = [
      axios
        .get(process.env.REACT_APP_URL_SERVER + "servicoFuncionario/")
        .then((res) => (res = res.data)),
      axios
        .get(process.env.REACT_APP_URL_SERVER + "grupoServico/")
        .then((res) => (res = res.data)),
      axios
        .get(process.env.REACT_APP_URL_SERVER + "servico/")
        .then((res) => (res = res.data)),
      axios
        .get(process.env.REACT_APP_URL_SERVER + "preco/")
        .then((res) => (res = res.data)),
      axios
        .get(process.env.REACT_APP_URL_SERVER + "funcionario/")
        .then((res) => (res = res.data)),
      axios
        .get(process.env.REACT_APP_URL_SERVER + "cliente/")
        .then((res) => (res = res.data)),
    ];

    Promise.all(requests).then(
      ([
        objServicoFuncionario,
        objGrupoServico,
        objServico,
        objPreco,
        objFuncionario,
        objCliente,
      ]) => {
        setServicosFuncionarios(objServicoFuncionario);
        setGruposServicos(objGrupoServico);
        setServicos(objServico);
        setPrecos(objPreco);
        setFuncionarios(objFuncionario);
        setClientes(objCliente);
        setCarregado(true);
      },
      (evt) => {
        console.log(evt);
      }
    );

    let dia = "29";
    let mes = new Date().getMonth() + 1;
    let ano = new Date().getFullYear();

    mes = mes.toString().length === 1 ? "0" + mes : mes;

    const dataInicial = new Date(ano + "-" + mes + "-" + dia);

    setDataInicial(dataInicial);

    mes = new Date().getMonth() + 2;
    mes = mes.toString().length === 1 ? "0" + mes : mes;
    const dataFinal = new Date(ano + "-" + mes + "-" + dia);
    setDataFinal(dataFinal);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const requests = [
      axios
        .get(
          process.env.REACT_APP_URL_SERVER +
            "agenda/fechamento/" +
            dateToStringAmericano(dataInicial) +
            "/" +
            dateToStringAmericano(dataFinal)
        )
        .then((res) => (res = res.data)),
    ];

    Promise.all(requests).then(
      ([objAgenda]) => {
        setAgenda(objAgenda);
      },
      (evt) => {
        console.log(evt);
      }
    );
  };

  useEffect(() => {
    carregaRelatorio({ situacao: "Confirmado" });
  }, [agenda]);

  const carregaRelatorio = (filtro) => {
    debugger;
    let objRelatorio = [];
    if (agenda.length > 0) {
      agenda
        .filter((o) => o.situacao === filtro.situacao)
        .map((obj) => {
          let o = {
            idFuncionario: obj.idFuncionario,
            funcionario: funcionarios.find((o) => o._id === obj.idFuncionario)
              .nome,
            cliente: clientes.find((o) => o._id === obj.idCliente).nome,
            servico: servicos.find((o) => o._id === obj.idServico).nome,
            data: obj.data,
            hora: obj.hora,
            total: obj.total,
            situacao: obj.situacao,
          };

          objRelatorio.push(o);
        });

      setListaRelatorio(ordenacao(objRelatorio, "funcionario", "asc"));
    }
  };

  const onChangeDataInicial = (e) => setDataInicial(e);

  const onChangeDataFinal = (e) => setDataFinal(e);

  const retornaLista = () => {
    let funcAnt = "";
    let objAgrupado = [];
    listaRelatorio.map((obj) => {
      if (funcAnt != obj.idFuncionario) {
        objAgrupado.push({
          idFuncionario: obj.idFuncionario,
          funcionario: obj.funcionario,
          dados: listaRelatorio.filter(
            (objg) => objg.funcionario === obj.funcionario
          ),
        });
        funcAnt = obj.idFuncionario;
      }
    });

    let retorno = objAgrupado.map((obj) => (
      <div>
        <div className="nomeFuncionario">{obj.funcionario}</div>
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Total Serviço</th>
                <th>Valor Funcionário</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {retornaDados(obj.dados)}
              <tr>
                <td colspan="5"></td>
                <td className="total">
                  R$ {valorTotalFuncionario(obj.idFuncionario)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ));

    return retorno;
  };

  const retornaDados = (dados) => {
    return dados.map((obj) => (
      <tr>
        <td>{obj.cliente}</td>
        <td>{obj.servico}</td>
        <td>{serverDateToString(obj.data)}</td>
        <td>{obj.hora}</td>
        <td>R$ {obj.total}</td>
        <td>R$ {calculaPercentualFuncionario(obj.idFuncionario, obj.total)}</td>
        <td>{obj.situacao}</td>
      </tr>
    ));
  };

  const calculaPercentualFuncionario = (id, valor) => {
    let obj = servicosFuncionarios.find((obj) => obj.idFuncionario === id);
    return (obj.percentual / 100) * valor;
  };

  const valorTotalFuncionario = (idFuncionario) => {
    let total = 0;
    listaRelatorio
      .filter((obj) => obj.idFuncionario === idFuncionario)
      .map((obj) => {
        total += calculaPercentualFuncionario(idFuncionario, obj.total);
      });
    return total;
  };

  const onChangeSituacao = (e) => {
    debugger;
    if (e.target.value === "D") carregaRelatorio({ situacao: "Desmarcado" });
    else if (e.target.value === "C")
      carregaRelatorio({ situacao: "Confirmado" });
    else if (e.target.value === "M") carregaRelatorio({ situacao: "Marcado" });
  };

  return (
    <div className="form-wrapper">
      {mensagem && <Mensagem tipo={mensagem.tipo} texto={mensagem.mensagem} />}
      {carregado && (
        <Form onSubmit={onSubmit}>
          <div className="row">
            <div className="col">
              <Form.Group controlId="DataInicial">
                <Form.Label for="dataInicial">Data Inicial:</Form.Label>
                <div className="row">
                  <div className="col-6">
                    <DatePicker
                      name="dataInicial"
                      className="form-control"
                      selected={dataInicial}
                      onChange={onChangeDataInicial}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
              </Form.Group>
            </div>
            <div className="col">
              <Form.Group controlId="DataFinal">
                <Form.Label for="dataFinal">Data Final:</Form.Label>
                <div className="row">
                  <div className="col-6">
                    <DatePicker
                      name="dataFinal"
                      className="form-control"
                      minDate={new Date()}
                      selected={dataFinal}
                      onChange={onChangeDataFinal}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
              </Form.Group>
            </div>
            <div className="col">
              <Container id="Botoes">
                <Row>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic mixed styles example"
                  >
                    <button type="submit" className="btn btn-primary">
                      Gerar
                    </button>
                  </div>
                </Row>
              </Container>
            </div>
          </div>
        </Form>
      )}
      {listaRelatorio.length > 0 && (
        <Form.Group controlId="Filtro">
          <div className="row">
            <div className="col-2">
              <Form.Label for="filtro">Filtro:</Form.Label>
            </div>
            <div className="col-8">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="radioConf"
                  value="C"
                  onChange={onChangeSituacao}
                />
                <label class="form-check-label" for="radioConf">
                  Confirmado
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="radioDes"
                  value="D"
                  onChange={onChangeSituacao}
                />
                <label class="form-check-label" for="radioDes">
                  Desmarcado
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="radioMar"
                  value="M"
                  onChange={onChangeSituacao}
                />
                <label class="form-check-label" for="radioMar">
                  Marcado
                </label>
              </div>
            </div>
            <div className="col-2">
              <button type="button" className="btn btn-primary">
                Exportar PDF
              </button>
            </div>
          </div>
        </Form.Group>
      )}
      <div className="row">{listaRelatorio.length > 0 && retornaLista()}</div>
    </div>
  );
}
