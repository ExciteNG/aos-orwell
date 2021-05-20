const {requireJWT} = require('../middleware/auth')
const router = require('express').Router();
const ReceivablesCtrl = require('../controller/receivablesBook');

// const Records = require('../models/salesBook');
// const Profiles = require('../models/Profiles');
// const bodyParser = require('body-parser');
// router.use(bodyParser.urlencoded({extended:true}));
// router.use(bodyParser.json());

// add a new record
router.post('/new' , requireJWT, ReceivablesCtrl.createRecord);

// update a record
router.put('/:id', ReceivablesCtrl.updateRecord);

// get all records
router.get('/all', requireJWT, ReceivablesCtrl.getAllRecords);

// get a record by id
router.get('/:id', ReceivablesCtrl.getOneRecord);

// delete all records
router.delete('/record', ReceivablesCtrl.deleteAllRecords);

//delete a record
router.delete('/:id', ReceivablesCtrl.deleteOneRecord);

module.exports = router
