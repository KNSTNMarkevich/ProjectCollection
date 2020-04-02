const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required:true},
    dateReg: {type: Date, default: Date.now},
    dateLog: {type: Date, required: false, default: null},
    status: {type: String, default: 'Не заблокирован'},
    blocked: {type: Boolean, default: false},
    links: [{ type: Types.ObjectId, ref: 'Link' }]
});

module.exports = model('User', schema);