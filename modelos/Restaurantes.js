const mongoose = require('mongoose');
const { Schema } = mongoose;

const restaurante = new Schema();

restaurante.add({
    nombre: {type: String, required:true},
    direccion: {type: String, required: true},
    localidad: {type: String, required: true},
    telefono: {type: String, required: true},
    activo: {type: Boolean, required: true}
});

module.exports = mongoose.model('restaurante', restaurante);
