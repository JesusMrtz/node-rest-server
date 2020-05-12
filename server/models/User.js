const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    image: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: validRoles

    },
    status: {
        type: Boolean,
        default: true,
    },
    googleSignIn: {
        type: Boolean,
        default: false
    }
});

/** 
 * Eliminar la propiedad password del retorno del objecto
 * No se recomienda utilizar arrow function ya que se necesita el this 
 */
userSchema.methods.toJSON = function() {
    let userObject = this.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});


module.exports = mongoose.model('user', userSchema);