/* eslint-disable prettier/prettier */
function emailHost(){

    return process.env.NODE_ENV === 'development' ? 'http://localhost:7000' : 'https://exciteenterprise.com';
    
}

module.exports = emailHost; 