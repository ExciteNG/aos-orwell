
const axios = require("axios");
const API_KEY = process.env.SOCIAL_API_KEY;


// const API_KEY = "DK9XQB2-FRG4RPK-QB2905F-6AQ1XE5";
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

const createProfileKey = async (userEmail) => {
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };
  
    const endpoint = "https://app.ayrshare.com/api/profiles/create-profile";
    const theProfileKey = await axios
      .post(endpoint, {
        title: userEmail,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          return res.data["profileKey"];
        } else {
          return null;
        }
      })
      .catch((e) => {
        console.log(e);
        return null;
      });
  
    return theProfileKey;
  };
  
const createJWTtoken = async (userProfileKey) => {
    const profileKey = userProfileKey;
  
    const endpoint = "https://app.ayrshare.com/api/profiles/generateJWT";
  
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };
  
    const theToken = await axios
      .post(endpoint, {
        domain: "exciteafrica",
        privateKey: privateKey,
        apiKey: API_KEY,
        profileKey: userProfileKey,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          return res.data["token"];
        } else {
          return null;
        }
      })
      .catch((e) => {
        console.log(e);
        return null;
      });
  
    return theToken;
  };
  
  module.exports={
      createProfileKey,
      createJWTtoken
  }