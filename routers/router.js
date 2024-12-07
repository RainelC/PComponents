const express = require('express');
const router = express.Router();
const model = require('../models/pcParts');
const multer = require('multer');
const path = require('path');

const { availableMemory } = require('process');
const { userInfo } = require('os');
const { error } = require('console');

const folderUpload = path.join(__dirname, '../upload');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, folderUpload);
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
});

var upload = multer({
    storage: storage
}).single('photo');

router.get('/', async (req, res) => {
    try{
        const components = await model.find({})
        res.render('index', {title: 'PComponents', data: components})
    }
    catch(error){
        res.json({message: error.message});
    }
});

router.get('/add', (req, res) => {
    res.render('add', {title: 'Add'})
});

router.post('/add', upload, (req, res) => {
    const component = new model({
        product_code: req.body.code,
        name: req.body.name,
        product_photo: req.file.filename,
        description: req.body.description,
        available: req.body.amount,
        price: req.body.price
    });

    component.save().then(() => {
        console.log("Save Success");
        res.redirect('/');
    }).catch((error) => {
        console.log(error);
    });
});

module.exports = router;