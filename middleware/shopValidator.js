const {check,body} = require('express-validator');

const addProductValidator = [
    body('title').isAlphanumeric().isLength({min:3}).trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({min:5}).trim(),
]


module.exports= addProductValidator;