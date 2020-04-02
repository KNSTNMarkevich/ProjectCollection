const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    text: {type: String, required: true},
    dateCreate: { type: Date, default: Date.now },
    dateChanged: {type: Date, default: null},
    x: {type: Number, default:50},
    y: {type: Number, default:60},
    color: {type: String, default: 'yellow'},
    from: { type: String, required: true},
    to: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    owner: { type: Types.ObjectId, ref: 'User' }
});

module.exports = model('Link', schema);