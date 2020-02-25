const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let funcionarioSchema = new Schema({
  nome: {
    type: String
  },
  email: {
    type: String
  },
  dataNascimento: {
    type: Date
  },
  cpf: {
    type: String
  },
  rg: {
    type: String
  },
  endereco: {
    type: String
  },
  idCidade: {
    type: String
  },
  celular: {
    type: String
  }
}, {
    collection: 'funcionarios'
  })

module.exports = mongoose.model('Funcionario', funcionarioSchema)