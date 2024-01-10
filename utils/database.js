const mongodb = require("mongodb");
const MongoCient =   mongodb.MongoClient;

let _db;

const MongoConnect = (callback) => {
  MongoCient.connect(
    process.env.MONGO_URL,
    )
    .then((client) => {

      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log('there is some errr',err);
      throw err;
    });
};


const getDb =()=>{
  if(_db){
    return _db;
  }

  throw 'Database not Found!!';
}

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;
