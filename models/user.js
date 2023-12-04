const mongoDb = require("mongodb");
const getDb = require("../utils/database").getDb;

class Users {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    return getDb().collection("users").insertOne(this);
  }

  addToCart(product) {
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
        productId: new mongoDb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    return getDb()
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const productsId = this.cart.items.map((i) => {
      return i.productId;
    });
    return getDb()
      .collection("products")
      .find({ _id: { $in: productsId } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      })
      .then((prod) => {
        console.log(prod);
        return prod;
      })
      .catch((err) => {
        //console.log('error occured',err);
      });
  }

  deleteFromCart(prodId) {
    const cartItems = this.cart.items.filter((i) => {
      return i.productId.toString() !== prodId.toString();
    });
    const updatedCart = {
      items: cartItems,
    };

    return getDb()
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addOrder() {

    return this.getCart().then(products=>{
      const order ={
        items:products,
        user:{
          _id: new mongoDb.ObjectId(this._id),
          name: this.name,
        }
      }

      return getDb()
      .collection("orders")
      .insertOne(order)
      .then((result) => {
        this.cart = { items: [] };

        return getDb()
        .collection("users")
        .updateOne(
          { _id: new mongoDb.ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        )})
        .then((result) => {
          console.log(result);
          return result;
        })
        .catch((err) => {
          console.log(err);
        });

    })
    }
  

  getOrders(){
    return getDb().collection('orders').find({'user._id': new mongoDb.ObjectId(this._id)}).toArray();

  }

  static findById(id) {
    return getDb()
      .collection("users")
      .find({ _id: new mongoDb.ObjectId(id) })
      .next();
  }
}
module.exports = Users;
