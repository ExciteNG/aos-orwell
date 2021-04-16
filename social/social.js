// const { Op } = require("sequelize");
const axios = require("axios");
const Profiles = require('./../models/Profiles')


// 
const {createProfileKey,createJWTtoken} = require('./init')

// const API_KEY = "DK9XQB2-FRG4RPK-QB2905F-6AQ1XE5";
const API_KEY = process.env.SOCIAL_API_KEY;
const postMsg = "Today is a great day!";

const social_media_link =
  "https://app.ayrshare.com/social-accounts?domain=exciteafrica&jwt=TOKEN";

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCM/SHKWzw+8Qa9SuikDMmi/n60pu1uva3iqvAjTqSnDGUx8FWA
a2FRufJVFTKO2PqbRU7DYawPhr7LyzW89n1jr10qqsKyeeuWG+kJ41WvY3nJ2KMq
/kLb8YvoVUqJ6TgrMz1ogRH52IddbGWzumSHUF0w1vwn7u7PEfcqIZ2OpQIDAQAB
AoGABhuFFjYDkxpv101ibJDdP0FVDdBZYr22xaXwByeF/HKOA67MlWaRba/nboYf
jY6atJU5Bz+462dD5qIj7s6iudlNxxlrWQLRd76cKzNgvjkajP7MRwsaTcaE1oN4
o2d5xFREYB/K1t2h/MD/7S8fP++dXq80FHr5ILHhlmKQQlUCQQDAl5Gqr1X5KtlY
G8XBeYJW9hNVTXX72+PtqGCUVo8VcK8FHQgKS6eFDCEKsc7lB6ngagS+9LZfmQs5
tFukKGP7AkEAu2g7kE+8+P/83tyFuob/tLTwMSm3lxDGWJiA9oB63LDeji/Z6UwU
EH8UE18ddRwGkXdtsBTRUYMPxPBGUNq13wJAYmkQtfcCJ2ANz0fhtQsx3t2+40fB
kgC6ZyYys5nHY11BEYvUH+6omwOnnp9c6QsRcuq5ohnJVvANHF9ctHUvIQJBAJu/
upDq1ACUrtGAsFseyvCh12TkaMHRnSYQSE2U5Yb4L144AoBTS/GRy1t2FwM28XZ/
rNdD1dpKdBaWIbocqj0CQQCNxZhaExOhFGRoPYjQekHEX4fFQyniuOlEcXwnJ3uV
LxNDLcAI0b568RE+yGXfqNyeT+qU/dbOM/vOsES3wfX9
-----END RSA PRIVATE KEY-----`;



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
console.log(userID,data)
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
    // console.log('uploading`....')
    const posting =  await axios
      .post(endpoint, {
        post: title, // required
        platforms: ["facebook"], // required
        profileKeys: [AryshareProfileKey], // required for client posting
        media_urls: [imageUrl], //optional
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
        console.log('from aryshare api', e.response.data, e.response.status);
        return false;
      });
      return posting
};

module.exports = {
  StoreUserSocailInformation,
  PostToSocialMedia
};
