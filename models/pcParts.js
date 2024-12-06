const { name } = require('ejs');
const mongoose = require('mongoose');

const partsSchema = new mongoose.Schema({
    product_code:{
        type: String,
        require: true
    },     
    name:{
        type: String,
        require: true
    },
    product_photo:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    available:{
        type: Number,
        require: true
    },
    price:{
        type: Number,
        require: true
    }
});

const pcPart = mongoose.model('pcPart', partsSchema);


module.exports = pcPart;