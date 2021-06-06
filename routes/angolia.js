const express = require('express');

const router = express.Router();


// For the default version
const algoliasearch = require('algoliasearch');

// For the default version
// import algoliasearch from 'algoliasearch';

// For the search only version
// import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('P2SZ64MDN1', process.env.ANGOLIA_SECRET);
const index = client.initIndex('excite_africa');

router.post('/post-to-angolia',(req,res)=>{
    const objects = [{
        name: 'Jimmie',
        description: 'Barninger'
      }, {
        name: 'Kazeem',
        description: 'Speach'
      }];
      
      index
        .saveObjects(objects, { autoGenerateObjectIDIfNotExist: true })
        .then(({ objectIDs }) => {
          console.log(objectIDs);
          res.send(objectIDs)
        });
})




module.exports = router;
