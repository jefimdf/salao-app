import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import {ErrorBoundary} from 'react-error-boundary'


import Home from "./components/home.component";

//Usuario
import CreateUsuario from "./components/Administracao/Usuario/create-usuario.component";
import EditUsuario from "./components/Administracao/Usuario/edit-usuario.component";
import ListUsuario from "./components/Administracao/Usuario/usuario-list.component";

//Cidade
import CreateCidade from "./components/Administracao/Cidade/create-cidade.component";
import EditCidade from "./components/Administracao/Cidade/edit-cidade.component";
import ListCidade from "./components/Administracao/Cidade/cidade-list.component";

//Grupo de Serviços
import CreateGrupoServico from "./components/Administracao/GrupoServico/create-grupoServico.component";
import EditGrupoServico from "./components/Administracao/GrupoServico/edit-grupoServico.component";
import ListGrupoServico from "./components/Administracao/GrupoServico/grupoServico-list.component";

//Serviço
import CreateServico from "./components/Administracao/Servico/create-servico.component";
import EditServico from "./components/Administracao/Servico/edit-servico.component";
import ListServico from "./components/Administracao/Servico/servico-list.component";

//Cliente
import CreateCliente from "./components/Cliente/create-cliente.component";
import EditCliente from "./components/Cliente/edit-cliente.component";
import ListCliente from "./components/Cliente/cliente-list.component";

//Funcionario
import CreateFuncionario from "./components/Administracao/Funcionario/create-funcionario.component";
import EditFuncionario from "./components/Administracao/Funcionario/edit-funcionario.component";
import ListFuncionario from "./components/Administracao/Funcionario/funcionario-list.component";

//Preço
import CreatePreco from "./components/Administracao/Preco/create-preco.component";
import EditPreco from "./components/Administracao/Preco/edit-preco.component";
import ListPreco from "./components/Administracao/Preco/preco-list.component";

//Serviço Funcionário
import CreateServicoFuncionario from "./components/Administracao/ServicoFuncionario/create-servicoFuncionario.component";
import EditServicoFuncionario from "./components/Administracao/ServicoFuncionario/edit-servicoFuncionario.component";
import ListServicoFuncionario from "./components/Administracao/ServicoFuncionario/servicoFuncionario-list.component";

//Agenda
import CreateAgenda from "./components/Agenda/create-agenda.component";
import EditAgenda from "./components/Agenda/edit-agenda.component";
import ListAgenda from "./components/Agenda/agenda-list.component";
import ViewAgenda from "./components/Agenda/agenda-view.component";

//Login
import Login from "./components/Administracao/Login/login.component";

//Relatorio
import FechamentoMes from "./components/Administracao/Relatorio/fechamento-rel.component";


function App(props) {

  const [userLogado] = useState(window.sessionStorage.getItem('userLogado') ? window.sessionStorage.getItem('userLogado') : false);
  const [gerente] = useState(window.sessionStorage.getItem('gerente') ? window.sessionStorage.getItem('gerente') : false);
  const [userName] = useState(window.sessionStorage.getItem('userName'));
  const [detalhesErro, setDetalhesErro] = useState('');
  const [divNoneBlock, setDivNoneBlock] = useState('d-none');

console.log(gerente)

  /* useEffect(() => {
    let jaesta = window.location.pathname === '/create-agenda' ? true : false;
    if (!userLogado && !jaesta){
      window.location = '/create-agenda';
    }
  }, []); */

  const logout = () =>{
    window.sessionStorage.clear();
    window.location = '/';
  }

  const handleDetalhes = () =>{
    divNoneBlock === 'd-none' ? setDivNoneBlock('d-block') : setDivNoneBlock('d-none');    
  }

  function ErrorFallback({error, resetErrorBoundary}) {    
    return (
      <div className='alert alert-danger'  role="alert">
        <p>A aplicação gerou um erro:</p>
        <pre>{error.message}</pre>
        <div className="row">
        <div className="col"><a href="#" onClick={handleDetalhes}>Mais Detalhes</a></div>
        <div className="col"><button className="btn btn-info" onClick={resetErrorBoundary}>Tente novamente</button></div>
        </div>        
        <div className="row"><div className={divNoneBlock}>{detalhesErro}</div></div>        
      </div>
    )    
  }

  const myErrorHandler = (error: Error, info: {componentStack: string}) => {
    setDetalhesErro('Error:' +error + ' ' + info.componentStack);    
  }

  const retornaPagina = () => {
    console.log(props);
  }

  return (<Router>
    <div id="container" className="App">
      <header id="header" className="App-header">      
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <a href="#" className="navbar-brand">
              <Link to={userLogado ? "/agenda-view" : ""}>
                <div className="logo"></div>
              </Link>
            </a>
            {!userLogado && <div className="title">Nádia Beauty</div>}
            {userLogado && <div className="title">Bem vindo, {userName}&nbsp;&nbsp;&nbsp;</div>}
            <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav">
                  <a href={"/create-agenda"} class="nav-item nav-link">Agenda</a>
                  {(gerente==='true') &&<a href={"/cliente-list"} class="nav-item nav-link">Clientes</a>}                  
                  {(gerente==='true') && <NavDropdown title="Administração" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/usuario-list">Usuário</NavDropdown.Item>
                    <NavDropdown.Item href="/funcionario-list">Funcionário</NavDropdown.Item>
                    <NavDropdown.Item href="/servicoFuncionario-list">Serviços de Funcionário</NavDropdown.Item>
                    <NavDropdown.Item href="/grupoServico-list">Grupos de Serviços</NavDropdown.Item>
                    <NavDropdown.Item href="/servico-list">Serviço</NavDropdown.Item>
                    <NavDropdown.Item href="/preco-list">Preço</NavDropdown.Item>                
                    <NavDropdown.Item href="/cidade-list">Cidade</NavDropdown.Item>
                    <NavDropdown.Item href="/fechamento-rel">Fechamento Mês</NavDropdown.Item>
                    <NavDropdown.Item href="/agenda-list">Editar Agenda</NavDropdown.Item>
                  </NavDropdown>
                  }                                
                </div>
                <div className="navbar-nav ms-auto">
                    {userLogado &&              
                      <a href="#" onClick={()=>logout()} className="nav-item nav-link">Sair</a>
                    }
                    {!userLogado && 
                      <a href={"/login"} className="nav-item nav-link">Login</a>             
                                  }
                </div>
            </div>
        </div>
    </nav>
      </header>

      <Container id="body">
        <Row>
          <Col md={12}>
            <div>{retornaPagina()}</div>
            <div className="wrapper">
              <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}>
                <Switch>
                  <Route exact path='/' component={CreateAgenda} />
                  
                  <Route path="/create-usuario" component={CreateUsuario} />
                  <Route path="/edit-usuario/:id" component={EditUsuario} />
                  <Route path="/usuario-list" component={ListUsuario} />

                  <Route path="/create-cidade" component={CreateCidade} />
                  <Route path="/edit-cidade/:id" component={EditCidade} />
                  <Route path="/cidade-list" component={ListCidade} />

                  <Route path="/create-grupoServico" component={CreateGrupoServico} />
                  <Route path="/edit-grupoServico/:id" component={EditGrupoServico} />
                  <Route path="/grupoServico-list" component={ListGrupoServico} />

                  <Route path="/create-servico" component={CreateServico} />
                  <Route path="/edit-servico/:id" component={EditServico} />
                  <Route path="/servico-list" component={ListServico} />

                  <Route path="/create-cliente" component={CreateCliente} />
                  <Route path="/edit-cliente/:id" component={EditCliente} />
                  <Route path="/cliente-list" component={ListCliente} />

                  <Route path="/create-funcionario" component={CreateFuncionario} />
                  <Route path="/edit-funcionario/:id" component={EditFuncionario} />
                  <Route path="/funcionario-list" component={ListFuncionario} />

                  <Route path="/create-preco" component={CreatePreco} />
                  <Route path="/edit-preco/:id" component={EditPreco} />
                  <Route path="/preco-list" component={ListPreco} />

                  <Route path="/create-servicoFuncionario" component={CreateServicoFuncionario} />
                  <Route path="/edit-servicoFuncionario/:id" component={EditServicoFuncionario} />
                  <Route path="/servicoFuncionario-list" component={ListServicoFuncionario} />

                  <Route path="/create-agenda" component={CreateAgenda} />
                  <Route path="/edit-agenda/:id" component={EditAgenda} />
                  <Route path="/agenda-list" component={ListAgenda} />
                  <Route path="/agenda-view" component={ViewAgenda} />

                  <Route path="/login" component={Login} />

                  <Route path="/fechamento-rel" component={FechamentoMes} />
                  
                </Switch>
              </ErrorBoundary>
            </div>
          </Col>
        </Row>
      </Container>

      <footer id="footer">
        <div className="container">
          <div className="row">        
        </div>
        </div>
      </footer>

    </div>
  </Router>);
}

export default App;