const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let servicoFuncionarioSchema = new Schema({
  idFuncionario: {
    type: String
  },
  idServico: {
    type: String
  },
  percentual: {
    type: Number
  }  
}, {
    collection: 'servicosFuncionarios'
  })

module.exports = mongoose.model('ServicoFuncionario', servicoFuncionarioSchema)