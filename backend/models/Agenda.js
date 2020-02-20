const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let agendaSchema = new Schema({
  idServico: {
    type: String
  },
  idCliente: {
    type: String
  },
  idFuncionario: {
    type: String
  },
  data: {
    type: Date
  },  
  hora: {
    type: String
  },  
  total: {
    type: Number
  }
}, {
    collection: 'agendas'
  })

module.exports = mongoose.model('Agenda', agendaSchema)