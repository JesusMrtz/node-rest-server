const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    price: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});


module.exports = mongoose.model('product', productSchema);