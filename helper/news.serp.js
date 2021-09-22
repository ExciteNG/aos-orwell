const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("secret_api_key");

const params = {
  engine: "google",
  q: "BBN",    // query
  location: "Austin, Texas, United States",
  google_domain: "google.com",
  gl: "ng",     // localization
  hl: "en",
  tbm: "nws",  // to be matched
  num: "50"     // number of results
};

const callback = function(data) {
  console.log(data);
};

const callback2 = function(data) {
    console.log(data['twitter_results']);
  };

// Show result as JSON
search.json(params, callback);