/* eslint-disable prettier/prettier */
function emailHost(){
    if (process.env.NODE_ENV==='development'){
        return 'http://localhost:3000'
    }
    return 'https://exciteenterprise.com'
}

module.exports = emailHost;