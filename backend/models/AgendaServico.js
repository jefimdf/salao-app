const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let agendaServicoSchema = new Schema({
  idAgenda: {
    type: String
  },
  idServico: {
    type: String
  }
}, {
    collection: 'agendasServicos'
  })

module.exports = mongoose.model('AgendaServico', agendaServicoSchema)