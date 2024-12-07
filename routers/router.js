const express = require('express');
const router = express.Router();
const model = require('../models/pcParts');
const multer = require('multer');
const path = require('path');

const { availableMemory } = require('process');
const { userInfo } = require('os');
const { resourceLimits } = require('worker_threads');

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

router.get('/', (req, res) => {
    res.render('index', {title: 'PComponents'})
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
    });
});

// Delete
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id

    try {
        const component = await model.findByIdAndDelete(id);

        if (component != null && component.image != '') {
            try {
                fs.unlinkSync('./upload/' + resourceLimits.image)
            }
            catch(error) {
                console.log(error);
            }
        }

        req.session.message = {
            message: 'Artículo eliminado correctamente!',
            type: 'info'
        }

        res.redirect('/')
    }
    catch(error) {
        res.json({
            message: error.message,
            type: 'danger'
        })
    }
})

module.exports = router;