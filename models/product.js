const connection = require("../utils/database");
const mongoDb = require('mongodb');

const getDb = connection.getDb;

class Product {
  constructor(title, price, description, imageUrl,id,userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id= id? new mongoDb.ObjectId(id): null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbop;

    if(this._id){
      dbop = db.collection('products').updateOne({_id: (this._id)},{$set:this});
    }else{
      console.log('no this ran');
      dbop=db.collection("products").insertOne(this);
    }
      return dbop
      .then((result) => console.log(result))
      .catch((err) => {
        console.log(err);
      });
  }

   static fetchById(id){
    return getDb().collection('products').find({_id: new mongoDb.ObjectId(id)}).next().then(result=>{
      return result;
    }).catch(err=>console.log(err));
  }

  static fetchAll(){
    return getDb().collection('products').find().toArray().then((result)=>{
      return result;
    }).catch(err=>console.log(err));
  }

  static deleteById(prodId){
    const id = new mongoDb.ObjectId(prodId);
    return getDb().collection('products').deleteOne({_id:id}).then(result=>{
      console.log('Product Deleted!!');
    }).catch(err=>console.log(err));
  }

}

module.exports = Product;
