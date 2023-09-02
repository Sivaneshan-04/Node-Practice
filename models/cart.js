const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "../", "data", "cart.json");

module.exports = class Cart {

  static addProduct(id, price) {
    fs.readFile(p, (err, fileData) => {
      let cart = { product: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileData);
      }
  
      const elementIndex = cart.product.findIndex((prod) => prod.id === id);
      const element = cart.product[elementIndex];
      
      let newElement;
      if (element) {
        newElement = { ...element };
        newElement.qty = newElement.qty + 1;
        cart.product[elementIndex] = newElement;
      } else {
        newElement = { id: id, qty: 1 };
        cart.product = [...cart.product, newElement];
      }
      cart.totalPrice = cart.totalPrice + +price;
  
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileData) => {
      
      if (err) {
        return;
      }
      
      const cart = JSON.parse(fileData);
      const element = cart.product.find((prod) => prod.id === id);

      if(!element){
        return ;
      }

      cart.product = cart.product.filter((prod)=>prod.id !==id);
      cart.totalPrice = cart.totalPrice - (price*(+element.qty));      
  
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb){
    fs.readFile(p,(err,fileData)=>{
      const cart= JSON.parse(fileData);
      if(err)
        return cb(null);
      else  
        return cb(cart);
    });

  }
};

