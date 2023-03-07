const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let grupoServicoSchema = new Schema({
  nome: {
    type: String
  }  
}, {
    collection: 'gruposServicos'
  })

module.exports = mongoose.model('GrupoServico', grupoServicoSchema)