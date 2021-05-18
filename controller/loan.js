/* eslint-disable prettier/prettier */
const LoanModel = require('../models/loan');

const createAccountChannel = (req, res) => {
  const {
    surname,
    firstName,
    middleName,
    gender,
    dob,
    stateOrigin,
    lgaOrigin,
    streetNumber,
    addressRes,
    phoneNumber,
    phoneNumberAlt,
    BVN,
    bvnPhone,
    authPin,
    authPinHidden,
    email,
    kinOneSurname,
    kinOneMiddleName,
    kinOneFirstName,
    kinOneRelationship,
    kinOneEmail,
    kinOneNumber,
    kinTwoSurname,
    kinTwoMiddleName,
    kinTwoFirstName,
    kinTwoRelationship,
    kinTwoEmail,
    kinTwoNumber,
    employmentStatus,
    workAddress,
    workPlace,
    qualification,
    monthlyIncome,
    salaryPayDay,
    maritalStatus,
    annualRent,
    outstandingLoan,
    utility,
    passport,
    signature,
    identification,
  } = req.body;
  const NOK = [
    {
      surname:kinOneSurname,
    middleName:kinOneMiddleName,
    firstName:kinOneFirstName,
    relationship:kinOneRelationship,
    email:kinOneEmail,
    phone:kinOneNumber,
    },
    {
      surname:kinTwoSurname,
    middleName:kinTwoMiddleName,
    firstName:kinTwoFirstName,
    relationship:kinTwoRelationship,
    email:kinTwoEmail,
    phone:kinTwoNumber,
    },
  ]
  // eslint-disable-next-line prettier/prettier
  const newAcct = new LoanModel({...req.body,nextOfKin:NOK, fundingPartner:"CHANNELLE"});
  newAcct.save()
    .then((record) => {
      res.status(201).json({
        message: 'Loan record posted successful!ly'
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: 'Oops! Something went wrong.',
        err
      });
    });
};






module.exports = {
  
  createAccountChannel
}
