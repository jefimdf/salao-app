let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');

// Express Route
const studentRoute = require('../backend/routes/student.route')
const usuarioRoute = require('../backend/routes/usuario.route')
const agendaRoute = require('../backend/routes/agenda.route')
const agendaServicoRoute = require('../backend/routes/agendaServico.route')
const cidadeRoute = require('../backend/routes/cidade.route')
const clienteRoute = require('../backend/routes/cliente.route')
const funcionarioRoute = require('../backend/routes/funcionario.route')
const precoRoute = require('../backend/routes/preco.route')
const servicoRoute = require('../backend/routes/servico.route')
const servicoFuncionarioRoute = require('../backend/routes/servicoFuncionario.route')

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true
}).then(() => {
  console.log('Database sucessfully connected!')
},
  error => {
    console.log('Could not connect to database : ' + error)
  }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/students', studentRoute)
app.use('/usuario', usuarioRoute)
app.use('/agenda', agendaRoute)
app.use('/agendaServico', agendaServicoRoute)
app.use('/cidade', cidadeRoute)
app.use('/cliente', clienteRoute)
app.use('/funcionario', funcionarioRoute)
app.use('/preco', precoRoute)
app.use('/servico', servicoRoute)
app.use('/servicoFuncionario', servicoFuncionarioRoute)


// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// 404 Error
app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
