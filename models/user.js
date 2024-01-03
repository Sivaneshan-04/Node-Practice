const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  cart: {
    items: [{ productId: { type: Schema.Types.ObjectId ,ref: 'Product'}, quantity: Number }],
  },
});

userSchema.methods.addToCart = function(product){
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: (product._id),
      quantity: newQuantity,
    });
  }

  this.cart = {
    items: updatedCartItems,
  };
  
  return this.save();
}

userSchema.methods.deleteFromCart = function(prodId){
  const cartItems = this.cart.items.filter((i) => {
    return i.productId.toString() !== prodId.toString();
  });
  this.cart = {
    items: cartItems,
  };

  return this.save();
}

userSchema.methods.clearCart = function(){
  this.cart = {
    items : []
  };
  return this.save();
}

module.exports = mongoose.model('User',userSchema);