const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const db = require("../utils/database");

// const getData = (c)=>{
//     const p = (path.join(__dirname,'../','data','products.json'));
//         fs.readFile(p,(err,fileData)=>{

//             if(err){
//                 return c([]);
//             }
//             c(JSON.parse(fileData));
//         })
// }

module.exports = class Product {
  constructor(title, imageUrl, description, price, id) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // getData((products)=>{
    //     if(this.id){
    //         const existingProductIndex=products.findIndex(p=>p.id===this.id);
    //         products[existingProductIndex]=this;
    //     }
    //     else{
    //         this.id= Math.random().toString();
    //         products.push(this);
    //     }
    //     const p = (path.join(__dirname,'../','data','products.json'));
    //     fs.writeFile(p,JSON.stringify(products),(err)=>{
    //         console.log(err);
    //     });
    // });

    return db.execute(
      "INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static fetchAll(c) {
    // getData(c);

    return db.execute("SELECT * FROM products");
  }

  static deleteById(id) {
    // getData(products=>{
    //     const product = products.find(p=> p.id=== id);
    //     const updatedProducts = products.filter(p=>p.id !== id);
    //     const p = (path.join(__dirname,'../','data','products.json'));
    //     fs.writeFile(p,JSON.stringify(updatedProducts),(err)=>{
    //         if(!err){
    //             Cart.deleteProduct(id,product.price);
    //         }
    //     }
    //     );
    // })
  }

  static findById(id, cb) {
    // getData(products=>{
    //     const product = products.find(p=>p.id===id);
    //     if(product){
    //         cb(product);
    //     }
    //     else{
    //         cb({});
    //     }
    // })

    return db.execute('SELECT * FROM products WHERE products.id = ?',[id])
  }
};
