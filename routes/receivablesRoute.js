const {requireJWT} = require('../middleware/auth')
const router = require('express').Router();
const ReceivablesCtrl = require('../controller/receivablesBook');

// add a new record
router.post('/new' , requireJWT, ReceivablesCtrl.createRecord);

// update a record
router.put('/:id', requireJWT, ReceivablesCtrl.updateRecord);

// get all records
router.get('/all', requireJWT, ReceivablesCtrl.getAllRecords);

// get a record by id
router.get('/:id', requireJWT, ReceivablesCtrl.getOneRecord);

// delete all records
router.delete('/record', requireJWT, ReceivablesCtrl.deleteAllRecords);

//delete a record
router.delete('/:id', requireJWT, ReceivablesCtrl.deleteOneRecord);

module.exports = router
