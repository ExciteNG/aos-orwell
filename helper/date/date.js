let today = new Date();
let numberOfDaysToAdd = 6;
// today.setDate(today.getDate() + numberOfDaysToAdd); 
let dd = today.getDate();
let mm = today.getMonth();
let y = today.getFullYear();

const todaysDate = ()=> `${dd}/${mm}/${y}`
const addMonth = (month)=>`${dd}/${mm + month}/${y}`
 const addYear = (years)=>`${dd}/${mm}/${y + years}`

 module.exports={
     todaysDate,addMonth,addYear
 }