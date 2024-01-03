const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const orderSchema = new Schema({
    user: {
        userId:{
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
    },
    prods: [{
        productData : Object,
        quantity: Number
    }
]
});

module.exports = mongoose.model('Order',orderSchema);