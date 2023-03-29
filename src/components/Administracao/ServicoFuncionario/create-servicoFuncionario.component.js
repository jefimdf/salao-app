import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import handleOrdenar from '../../../common/ordenacao'


const tableName = 'servicoFuncionario';

export default function CreateServicoFuncionario(props) {

  const [idServico, setIdServico] = useState([]);
  const [percentual, setPercentual] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios]= useState([]);
  const [carregado, setCarregado] = useState(false);


  useEffect(() => {
    const requests = [      
      axios.get(process.env.REACT_APP_URL_SERVER + 'servico/')
        .then(res => res = res.data),
      axios.get(process.env.REACT_APP_URL_SERVER + 'funcionario/')
        .then(res => res = res.data)      
  ]

  Promise.all(requests)
    .then(([objServico, objFuncionario]) => {      

      let objServicos = objServico.map(obj=>{
        return {
          value: obj._id,
          label:obj.nome
        }
      })

        setServicos(handleOrdenar(objServicos, 'label', 'asc'));
        setFuncionarios(handleOrdenar(objFuncionario, 'nome', 'asc'));
        setCarregado(true);
      
    }, (evt) => {
        console.log(evt);        
    })

  }, []);



  const cancelar = () => {
    props.history.push('/'+tableName+'-list');
  }

  const onChangeFuncionario = (e) => {
    setIdFuncionario(e.target.value)    
  }


  const onChangePercentual = (e) => {
    setPercentual(e.target.value)    
  }

  
  const onSubmit = (e) => {
    e.preventDefault();

    let sucesso = false;
    idServico.map(obj=>{
      const objEnvio = {
        idFuncionario: idFuncionario,
        idServico: obj.value,
        percentual: percentual
      };
  
      axios.post(process.env.REACT_APP_URL_SERVER + tableName + '/create', objEnvio)
        .then(res => {
          console.log(res.data);           
          sucesso=true;
        });
    })

    if (sucesso){
      props.history.push('/'+tableName+'-list');

      setIdServico([])
      setPercentual('')
      setIdFuncionario('')
      setServicos([])
      setFuncionarios([])
      
    }
    
  }

  const onFuncionarios = () => {
    return funcionarios.map((obj)=>{
      return (
        <option value={obj._id}>{obj.nome}</option>
      )
    })
  }

  const onChange = (e) => {
    if (e.length>0){
      setIdServico(e)
      
    }else{
      setIdServico([])
      
    }
  }

    return (<div className="form-wrapper">
      <Form onSubmit={onSubmit}>

        <Form.Group controlId="Funcionario">
          <Form.Label>Funcionários</Form.Label>
          <Form.Control as="select" value={idFuncionario} onChange={onChangeFuncionario}>
            <option value="0">Selecione...</option>
            {onFuncionarios()}
          </Form.Control> 
        </Form.Group>

        <Form.Group controlId="Servico">
          <Form.Label>Serviços</Form.Label>

          <Select    
    isMulti
    name="colors"
    options={servicos}
    className="basic-multi-select form-control"
    onChange={onChange}
    classNamePrefix="select"
  />
          
        </Form.Group>

        <Form.Group controlId="Percentual">
          <Form.Label>Percentual</Form.Label>          
          <Form.Control type="text" value={percentual} onChange={onChangePercentual} placeholder="00.00 %"/>
        </Form.Group>
        

      <Container id="Botoes">
      <Row>
              <div className="btn-group" role="group" aria-label="Basic mixed styles example">
              <button type="submit" className="btn btn-primary" >Criar</button>
              <button type="button" className="btn btn-warning" onClick={cancelar}>Cancelar</button>
            </div>
          </Row>
      </Container>
        
        
      </Form>
    </div>);
  
}
