const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let clienteSchema = new Schema({
  nome: {
    type: String
  },
  dataNascimento: {
    type: Date
  },  
  celular: {
    type: String
  },
  idCidade: {
    type: String
  }
}, {
    collection: 'clientes'
  })

module.exports = mongoose.model('Cliente', clienteSchema)