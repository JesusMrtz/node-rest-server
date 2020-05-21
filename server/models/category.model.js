const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let userSchema = new Schema({
    description: {
        type: String,
        required: [true, 'La descripción es necesaria'],
        unique: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'El usuario es necesario'],
    }
});


userSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});


module.exports = mongoose.model('category', userSchema);