// const { Op } = require("sequelize");
const axios = require("axios");
const Profiles = require('../models/Profiles')


// 
const {createProfileKey,createJWTtoken} = require('./init')


const API_KEY = process.env.SOCIAL_API_KEY;


// const social_media_link = "https://app.ayrshare.com/social-accounts?domain=exciteafrica&jwt=TOKEN";





const StoreUserSocailInformation = async (userID) => {
  // Get the User profile
  const user = await Profiles.findOne({email:userID});
  if(!user) return null;
  const userPlan = user.subscriptionLevel;
  const profileKeyExist=user.AryshareProfileKey;
  if(userPlan !==3) return null;

  //check if user has profileKey
  if(profileKeyExist) {
    //   create token
    const theJWT = await createJWTtoken(profileKeyExist);
    const context = {
      JWTtoken: theJWT,
    };
    return context;
    //   return {msg:'user has a key already',context}
  }

    // Create Profle Key if he/she doesnt
    // console.log('creating')
    const theProfileKey = await createProfileKey(userID);
    // Store into DB
      console.log("Storing into Profile Key DB");
      user.AryshareProfileKey = theProfileKey
    //save
      user.save()
    // -------------Create JWT Social kEY ------------ //
    try {
      const theJWT = await createJWTtoken(theProfileKey);
      
      const context = {
        JWTtoken: theJWT,
      };
      return context;
    } catch (e) {
      console.log("Failed When Updating JWT SOCIAL Key");

      console.log(e);
      return false;
    }
};

const PostToSocialMedia = async (userID, data) => {
// console.log(userID,data)
      // Get the User profile
  const user = await Profiles.findOne({email:userID});
  if(!user) return null;
  //check subscription
  const subscription = user.subscriptionLevel;
  if(subscription !== 3) return null
  //get the profileKey
  const AryshareProfileKey = user.AryshareProfileKey;
  
  if(!AryshareProfileKey) return null;
  const { title, imageUrl } = data;

    // ------- UPLOADING STARTS HERE ------------- //
    const endpoint = "https://app.ayrshare.com/api/post";

    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };
    console.log(`uploading.... ${API_KEY}`)
    const posting =  await axios
      .post(endpoint, {
        post: title, // required
        platforms: ["facebook"], // required
        profileKeys: [AryshareProfileKey], // required for client posting
        media_urls: [imageUrl.Location], //optional
        shorten_links: true, // optional
        // unsplash: "random", // optional
      })
      .then((res) => {
        //   console.log(res.data.status==='success')
        if (res.data.status==='success') {
          return true;
        } 
      })
      .catch((e) => {
        console.log('from aryshare api',  e);
        return false;
      });
      return posting
};

module.exports = {
  StoreUserSocailInformation,
  PostToSocialMedia
};
