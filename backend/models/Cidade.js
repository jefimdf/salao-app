const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cidadeSchema = new Schema({
  nome: {
    type: String
  }
}, {
    collection: 'cidades'
  })

module.exports = mongoose.model('Cidade', cidadeSchema)