
const axios = require("axios");
const API_KEY = process.env.SOCIAL_API_KEY;



const social_media_link =
  "https://app.ayrshare.com/social-accounts?domain=exciteafrica&jwt=TOKEN";

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgHe8JeR7qfR3M5afoTtjF+CZ2pHL/T/nRyZDKPrAOcQIJ7iMX26y
HoWeu/07+9t6qZCZlUEdokbSqLh0UsFrMc79DoGNEoPQ5shPUhi9nM2DGXJ2mqc7
E98a19kzeitGYZdRNttzAl8fFazAl9r/odQhX30lXI7ncD/e0yTdqrYRAgMBAAEC
gYBSMbGdeJsB+/ZJFwn6l5rjjxpw7aTLAnxgMshl4iGFhcems44rklDLj10jiNLr
JvhSEGxaR/qHPcOe5BOPPYPxyFL6MZMLHvzZnWKqco9OikBOwyNWQIdlOFQxBnVa
NUtTx36I9e1WFhgPgTepcnOKlkCOjgBt0rF1aIgf2mhslQJBAOMH4QEWqTL0CIOz
faBmnqRUnFzJDFrppa/nk0gpuyEbrSaEb1eSRVClm9i+xMlCxlgc1lndij39s7Sw
VDRk998CQQCHA2ACnQhq+ZGD1zyNP7yLKZgTAzu/DiH/g98L7zdBlbtalxs6ha8Y
GPv5qFn3RZhnDoM6PBtx8V80q951BdAPAkAlvtmZ5LqczhXcT6tDT8xwZeDZTFPR
iacSZ94E0WtbRc6z6LDaTmdX0TDoCE+PZpqza5f3uO2TAOsvz2EwlNjhAkBnPxB7
zyRx0foSbVVT2urPLPari2x0FVWwdWLrWHrT/7Hve+CJp1OXxPtkFvb9nk4GeVWn
AfIm92NL/ya2LMTHAkBmyVDVaqMHwetZmldLm31FFeytORxkAUpVZCKVgMV2IEB6
T8ib19zOAjILqAV53ioNK4KQdL/VUnY+hHSrJEtk
-----END RSA PRIVATE KEY-----`;

// const privateKey = process.env.ARYSHARE_PRIVATE_KEY


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
  // console.log(profileKey, 'profile')
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
          // console.log(res.data);
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