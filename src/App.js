import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

//Usuario
import CreateUsuario from "./components/Administracao/Usuario/create-usuario.component";
import EditUsuario from "./components/Administracao/Usuario/edit-usuario.component";
import ListUsuario from "./components/Administracao/Usuario/usuario-list.component";

//Cidade
import CreateCidade from "./components/Administracao/Cidade/create-cidade.component";
import EditCidade from "./components/Administracao/Cidade/edit-cidade.component";
import ListCidade from "./components/Administracao/Cidade/cidade-list.component";

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


function App() {
  return (<Router>
    <div className="App">
      <header className="App-header">
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>
              <Link to={"/agenda-list"} className="nav-link">
                Salão
              </Link>
            </Navbar.Brand>

            <Nav className="justify-content-end">
              <Nav>
                <Link to={"/create-agenda"} className="nav-link">
                  Agenda
                </Link>
              </Nav>
              <Nav>
                <Link to={"/create-cliente"} className="nav-link">
                  Clientes
                </Link>
              </Nav>
              <NavDropdown title="Administração" id="basic-nav-dropdown">
                <NavDropdown.Item href="/usuario-list">Usuário</NavDropdown.Item>
                <NavDropdown.Item href="/funcionario-list">Funcionário</NavDropdown.Item>
                <NavDropdown.Item href="/servicoFuncionario-list">Serviços de Funcionário</NavDropdown.Item>
                <NavDropdown.Item href="/servico-list">Serviço</NavDropdown.Item>
                <NavDropdown.Item href="/preco-list">Preço</NavDropdown.Item>                
                <NavDropdown.Item href="/cidade-list">Cidade</NavDropdown.Item>
              </NavDropdown>
              
            </Nav>

          </Container>
        </Navbar>
      </header>

      <Container>
        <Row>
          <Col md={12}>
            <div className="wrapper">
              <Switch>
                <Route exact path='/'  />
                
                <Route path="/create-usuario" component={CreateUsuario} />
                <Route path="/edit-usuario/:id" component={EditUsuario} />
                <Route path="/usuario-list" component={ListUsuario} />

                <Route path="/create-cidade" component={CreateCidade} />
                <Route path="/edit-cidade/:id" component={EditCidade} />
                <Route path="/cidade-list" component={ListCidade} />

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

              </Switch>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  </Router>);
}

export default App;