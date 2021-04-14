/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
let phoReg = new RegExp('(\d{3})\D*(\d{3})\D*(\d{4})\D*(\d*)$');
let x = '+2347081927814'
console.log(phoReg.test(x))

let myReg = new RegExp('^\\+\[0-9]+$')
let y = '+2347081927814'
console.log(myReg.test(y))