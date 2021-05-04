/* eslint-disable prettier/prettier */
function emailHost(){
    if (process.env.NODE_ENV==='development'){
        return 'http://localhost:3000'
    }
    return 'https://excite-frontend-dev.vercel.app'
}

module.exports = emailHost;