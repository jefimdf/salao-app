import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import MaskedFormControl from 'react-bootstrap-maskedinput';
import moment from 'moment';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import Mensagem from '../../../common/mensagem/Mensagem';

export default function CreateAgenda(props) {

  const [userLogado, setUserLogado] = useState(window.sessionStorage.getItem('userLogado') ? window.sessionStorage.getItem('userLogado') : false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [login, setLogin] = useState(true);
  const nonce = '';
  const tableName = 'usuario';
  const [mensagem, setMensagem] = useState({});

  useEffect(() => {
    if(userLogado)
      props.history.push('/agenda-view');            
  }, [userLogado]);

  const onChangeEmail = (e) =>{
    setEmail(e.target.value);
  }

  const onChangeSenha = (e) => {
    setSenha(e.target.value);
  }

  const onSubmit = (e) =>{
    e.preventDefault();

    const path='', privateKey='';

    const senhaCriptografada = Base64.stringify(hmacSHA512(path + sha256(nonce + senha), privateKey));

    const objEnvio = {
      email: email,
      senha: senhaCriptografada     
    };

    axios.get(process.env.REACT_APP_URL_SERVER + tableName)
      .then(res => {
        console.log(res.data); 
        
        let usuarioLocalizado = res.data.find(obj => obj.email === email);

        if (usuarioLocalizado && usuarioLocalizado.senha === senhaCriptografada){            
            window.sessionStorage.setItem('userLogado', true);
            window.location.reload();            
        }else{
            setLogin(false);
            setMensagem({tipo: 'erro', mensagem:'E-mail ou senha incorretos!'});            
        }
        
      });
      
  }

  const cancelar = ()=>{
    props.history.push('/');
  }

  return (<div className="form-wrapper">    
    {mensagem && <Mensagem tipo={mensagem.tipo} texto={mensagem.mensagem}/>}    
  <Form onSubmit={onSubmit}>
    <Form.Group controlId="Email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" value={email} onChange={onChangeEmail} />
    </Form.Group>

    <Form.Group controlId="Senha">
        <Form.Label>Senha</Form.Label>
        <Form.Control type="password" value={senha} onChange={onChangeSenha} />
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
</div>)


}