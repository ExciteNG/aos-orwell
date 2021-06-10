const express = require("express");
const router = express.Router();
const Profiles = require("../../models/Profiles")
const Affiliate = require("../../models/Affiliates")
const docss=require("./profiles.json")


router.get("/migrate-affiliate", async (req, res) => {
//    try {
  
//   docss.forEach(async users=>{
//     if(users.userType==="EX20AF"){
//       // console.log(users)
//       delete users["_id"]
//          const aff = Affiliate.create(users)

//          aff.then(doc=>{
//            console.log(doc)
//          })
//         //  await aff.save()
//          console.log('d')
//     }
//   })
  res.send('done')
// } catch (error) {
//   console.log(error,'err')
// }
 })


module.exports = router;
