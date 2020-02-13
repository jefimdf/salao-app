const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let agendaSchema = new Schema({
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
  }
}, {
    collection: 'agendas'
  })

module.exports = mongoose.model('Agenda', agendaSchema)