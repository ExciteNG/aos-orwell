/* eslint-disable prettier/prettier */
const passport = require("passport");
const crypto = require('crypto');
const JWT = require("jsonwebtoken");
const PassportJWT = require("passport-jwt");
const User = require("../models/User");
const Profile = require("../models/Profiles");
const randomstring = require("randomstring");
const { use } = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jwtSecret = process.env.JWT_SECRET;
// const jwtAlgorithm = process.env.JWT_ALGORITHM
const jwtAlgorithm = "HS256";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
//email templating 
const emailTemplate = require('./template');
passport.use(User.createStrategy());

/*                  SIGNUPs                         */

// Merchants
const signUp = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
   return  res.status(400).send("No username or password provided.");
  }
  // console.log(req.body)
  User.findOne({ email: req.body.email }, (err, doc) => {
    if (doc) {
      console.log(doc);
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      // continue
      const generateRefNo = randomstring.generate({
        length: 4,
        charset: "numeric",
        readable: true,
      });

      const user = {
        email: req.body.email,
        fullname: req.body.name,
        userType: "EX10AF",
        emailVerified: false,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 401, mesage: "Failed create account" });

          return;
        }
      });
  // 
      const profileInstance = new Profile(userInstance);
      profileInstance.fullname=req.body.fullname
      profileInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 401, mesage: "Failed to create profile" });
          return;
        }
      });
      // req.user = userInstance;
      res.json({ code: 201, mesage: "Account created" });
      // next();
    }
  });
};

// Partners
const signUpPartner = (req, res, next) => {
  const {
    email,
    password,
    phone,
    fullname,
    lga,
    state,
    companyName,
    rc,
    tin,
    serviceRendered,
    taxCert,
    cacCert,
    address,
  } = req.body;

  // console.log(req.body);
  const handleNature =()=>{
    switch (serviceRendered) {
      case "Tax Services":
        return "EX50AFTAX"
      case "Business Registration":
        return "EX50AFBIZ"
      case "Loan Services":
        return "EX50AFFIN"
      default:
        break;
    }
  }

  if (!email || !password) {
    res.status(400).send("No username or password provided.");
  }
  User.findOne({ email: email }, (err, doc) => {
    if (doc) {
      // conso
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      //continue
      const generateRefNo = randomstring.generate({
        length: 4,
        charset: "numeric",
        readable: true,
      });

      const user = {
        email: req.body.email,
        name: req.body.companyName,
        userType: handleNature(),
        emailVerified: false,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 401, mesage: "Failed create account" });

          return;
        }
      });
      const profileInstance = new Profile(userInstance);
      profileInstance.fullname = fullname;
      profileInstance.phone = phone;

      profileInstance.company = {
        name: companyName,
        address: address,
        rc: rc,
        tin: tin,
        nature: serviceRendered,
      };
      // very important : telling mongoose that this field has been modified
      // profile.markModified("company");
      profileInstance.identification = {
        idType: "",
        id: "",
        passport: "",
        signature: "",
        cacCert: cacCert,
        taxCert: taxCert,
      };
      profileInstance.location = { address: address, state: state, lga: lga };
    
      profileInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 401, mesage: "Failed to create profile" });
          return;
        }
      });
      // req.user = userInstance;
      res.json({ code: 201, mesage: "Account created" });
      // next();
    }
  });
};

// Affiliates
//create  signup token
const signUpAffiliates = (req, res, next) => {
  let token = crypto.randomBytes(12).toString('hex');
  const {
    email,
    password,
    phone,
    fullname,
    lga,
    state,
    cell,
    idType,
    idImg,
    passportImg,
    address,
  } = req.body;
  if (!email || !password) {
    res.status(400).send("No username or password provided.");
  }
  User.findOne({ email: req.body.email }, (err, doc) => {
    if (err) {
      res.json({ code: 401, msg: "Error ocured" });
    }
    if (doc) {
      // console.log(doc);
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      //continue
      const generateRefNo = randomstring.generate({
        length: 4,
        charset: "numeric",
        readable: true,
      });
      //  let clientRefNo= `HR-CL-${generateRefNo}`,

      const user = {
        email: email,
        name: fullname,
        userType: "EX20AF",
        emailVerified: false,
      };
      const userInstance = new User(user);
      const msg = {
        to: user.email, // Change to your recipient
        from: 'iyayiemmanuel1@gmail.com', // Change to your verified sender
        subject: 'Notice of a Transaction',
        text: emailTemplate(user.fullname,'/auth/affiliate/sign-up/',token),
        html:  `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:tahoma, verdana, segoe, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>Verify Your Account</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><style type="text/css">#outlook a {	padding:0;}.ExternalClass {	width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {	line-height:100%;}.es-button {	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}[data-ogsb] .es-button {	border-width:0!important;	padding:10px 20px 10px 20px!important;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } h2 a { text-align:center } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important } h3 a { text-align:center } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } img { max-width:100%; height:auto; object-fit:cover } }</style></head>
<body style="width:100%;font-family:tahoma, verdana, segoe, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div class="es-wrapper-color" style="background-color:#E8E8E4"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#e8e8e4"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#E8E8E4"><tr style="border-collapse:collapse"><td valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse"><td align="center" bgcolor="#000000" style="padding:0;Margin:0;background-color:#000000"><table class="es-header-body" cellspacing="0" cellpadding="0" align="center" bgcolor="#000000" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#000000;width:600px"><tr style="border-collapse:collapse"><td align="left" style="Margin:0;padding-top:10px;padding-left:15px;padding-right:15px;padding-bottom:20px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:570px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://liiueu.stripocdn.email/content/guids/824d24ad-c799-4852-9a7b-0f149e1a4cbb/images/28481619431982683.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="82" width="120"></td>
</tr></table></td></tr></table></td></tr></table></td>
</tr></table><table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:20px;font-style:normal;font-weight:400;color:#6FD20D">Verify Your Account</h3>
<br> Dear ${user.fullname}, Please click on the following link, or paste this into your browser to complete the signup process. <a href="http://${req.headers.host}/auth/affiliate/sign-up/${token}" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#02951E;font-size:14px">Verify your Account</a> If you did not request this, please ignore this email and your password will remain unchanged.</td></tr></table></td></tr></table></td></tr></table></td>
</tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr style="border-collapse:collapse"></tr><tr style="border-collapse:collapse"><td align="center" bgcolor="#ffffff" style="padding:0;Margin:0;background-color:#FFFFFF"><table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr style="border-collapse:collapse"><td align="left" style="padding:0;Margin:0"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:600px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"></table></td>
</tr></table></td></tr></table></td>
</tr></table><table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr style="border-collapse:collapse"><td align="center" bgcolor="#6fd20d" style="padding:0;Margin:0;background-color:#6FD20D"><table class="es-footer-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#000000;width:600px" bgcolor="#000"><tr style="border-collapse:collapse"><td align="left" bgcolor="#6fd20d" style="padding:0;Margin:0;padding-top:30px;padding-left:30px;padding-right:30px;background-color:#6FD20D"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:540px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" bgcolor="#6fd20d" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px"><br><br>This email was sent by Excite Africa.</p>
</td></tr><tr style="border-collapse:collapse"><td align="center" bgcolor="#6fd20d" style="padding:0;Margin:0;padding-bottom:5px;padding-top:15px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">© Excite Inc.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">3,&nbsp; Dapo Bode Street Yaba Phase 2 Lagos, Nigeria</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">Company Number: 07012345</p></td>
</tr><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px;font-size:0px;background-color:#6FD20D" bgcolor="#6fd20d"><table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px"><img title="Twitter" src="https://stripo.email/cabinet/assets/editor/assets/img/social-icons/square-gray/twitter-square-gray.png" alt="Tw" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
<td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px"><img title="Facebook" src="https://stripo.email/cabinet/assets/editor/assets/img/social-icons/square-gray/facebook-square-gray.png" alt="Fb" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td><td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px"><img title="Instagram" src="https://stripo.email/cabinet/assets/editor/assets/img/social-icons/square-gray/instagram-square-gray.png" alt="Ig" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
<td valign="top" align="center" style="padding:0;Margin:0"><img title="Google+" src="https://stripo.email/cabinet/assets/editor/assets/img/social-icons/square-gray/google-plus-square-gray.png" alt="G+" width="24" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td></tr></table></td></tr><tr style="border-collapse:collapse"><td align="center" bgcolor="#6fd20d" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;line-height:18px;color:#FFFFFF;font-size:12px">You are receiving this email because you have visited our site or asked us about regular newsletter. Make sure our messages get to your Inbox (and not your bulk or junk folders). Please add hello@bookkeeping.com to your contacts</p></td></tr></table></td></tr></table></td></tr></table></td>
</tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr style="border-collapse:collapse"><td align="center" bgcolor="#ffffff" style="padding:0;Margin:0;background-color:#FFFFFF"><table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px" cellspacing="0" cellpadding="0" align="center" bgcolor="#fff"><tr style="border-collapse:collapse"><td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr style="border-collapse:collapse"><td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://liiueu.stripocdn.email/content/guids/824d24ad-c799-4852-9a7b-0f149e1a4cbb/images/15671619429660563.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="82" width="120"></td>
</tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body></html>`,
      }
      
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((err) => {
          console.error(err)
        })
}
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 401, mesage: "Failed create account" });
          return;
        }
      });

      const profileInstance = new Profile(userInstance);
      profileInstance.fullname = fullname;
      profileInstance.phone = phone;
      profileInstance.cellInfo = {
        cell: cell,
        cellGroup: "",
        isCellHead: false,
        isClusterHead: false,
        cluster: "",
      };
      profileInstance.identification = {
        idType: idType,
        id: idImg,
        passport: passportImg,
        signature: "",
      };
      profileInstance.location = { address: address, state: state, lga: lga };

      profileInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 401, mesage: "Failed to create profile" });
          return;
        }
      });
      // req.user = userInstance;
      res.json({ code: 201, mesage: "Account created" });
      // next();
    }
  });
};

//verify account via the email token
const verifyAffiliateToken =  (req,res) =>{
  let token = req.params.token
  if (token){
    res.json({message:"account registered successfully"})
  }else{
    res.json({error:"an error ocurred while registering your account"})
  }
}


// Signup User Via Refcode
const signUpRefCode =async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("No username or password provided.");
  }
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (doc) {
      // console.log(doc);
      res.json({ code: 401, msg: "Account exist", doc });
      next(err);
    } else {
      //continue

      const user = {
        email: req.body.email,
        name: req.body.name,
        userType: "EX10AF",
        emailVerified: false,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 400, mesage: "Failed create account" });

          return;
        }
      });
      const profileInstance = new Profile(userInstance);
      let profiler = profileInstance
      profiler.referral.isReffered = true
      profiler.referral.refCode = req.body.refCode;
      profileInstance.save((err, doc) => {
        if (err) {
          // next(err);
          res.json({ code: 400, mesage: "Failed to create profile" });
          return;
        }
      });
// TODO restructure
      const refBy = await Profile.findOne({affiliateCode:req.body.refCode})

      if(!refBy) return   res.json({ code: 201, mesage: "Account created" });
      if(refBy){
        let currentCnt = refBy.affiliateCount;
        refBy.affiliateCount = currentCnt + 1;
        refBy.markModified('affiliateCount')
        refBy.save()
        res.json({ code: 201, mesage: "Account created" });
      }
      // req.user = userInstance;
    
      // next();
    }
  });
};

const setUpSpringBoard = (req,res,next)=>{
  if(req.body.token !== process.env.SPRING_BOARD_ACCESS_TOKEN) return res.status(400).json({msg:"Invalid Token"})
  if (!req.body.email || !req.body.password) {
    res.status(400).send("No username or password provided.");
  }
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (doc) {
      // console.log(doc);
      res.json({ code: 401, msg: "Account exist" });
      next(err);
    } else {
      //continue
      const user = {
        email: req.body.email,
        name: 'SpringBoard',
        userType: "EXSBAF",
        emailVerified: true,
      };
      const userInstance = new User(user);
      User.register(userInstance, req.body.password, (error, user) => {
        if (error) {
          // next(error);
          res.json({ code: 400, mesage: "Failed create account" });
          return;
        }
        res.json({ code: 201, mesage: "Account Set Successfully." });
      });
    }
  });
}








/*                  SIGN JWTS                        */
// Merchants Login
const signJWTForUser = (req, res) => {
  // console.log('signing jwt', req.user)
  // check login route authorization
  if (req.user.userType !== "EX10AF")
    return res.status(400).json({ msg: "invalid login" });
  const user = req.user;
  const token = JWT.sign(
    {
      email: user.email,
      userType: user.userType,
    },
    jwtSecret,
    {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn,
      subject: user._id.toString(),
    }
  );
  // console.log(token);
  res.json({ token });
};
// Affiliates Login
const signJWTForAffiliates = (req, res) => {
  // console.log('signing jwt', req.user)
  // check login route authorization
  if (req.user.userType !== "EX20AF")
    return res.status(400).json({ msg: "invalid login" });
  const user = req.user;
  const token = JWT.sign(
    {
      email: user.email,
      userType: user.userType,
    },
    jwtSecret,
    {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn,
      subject: user._id.toString(),
    }
  );
  // console.log(token);
  res.json({ token });
};
// Partners Login
const signJWTForPartners = (req, res) => {
  // console.log('signing jwt', req.user)
  // check login route authorization
  // const org = req.user.userType
  if (req.user.userType !== ("EX50AFTAX" || "EX50AFBIZ" || "EX50AFFIN"))
    return res.status(400).json({ msg: "invalid login" });
  const user = req.user;
  const token = JWT.sign(
    {
      email: user.email,
      userType: user.userType,
    },
    jwtSecret,
    {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn,
      subject: user._id.toString(),
    }
  );
  // console.log(token);
  res.json({ token });
};
// SpringBoards Login
const signJWTForSpringBoard = (req, res) => {
  // console.log('signing jwt', req.user)
  // check login route authorization
  if (req.user.userType !== "EXSBAF")
    return res.status(400).json({ msg: "invalid login" });
  const user = req.user;
  const token = JWT.sign(
    {
      email: user.email,
      userType: user.userType,
    },
    jwtSecret,
    {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn,
      subject: user._id.toString(),
    }
  );
  // console.log(token);
  res.json({ token });
};

//PAGE AUTHORIZATION

const authPageMerchant = (req, res) => {
  if (req.user.userType !== "EX10AF")
    return res.status(400).json({ msg: "invalid login" });
  res.json({ code: 200, auth: true });
};
const authPageAffiliate = (req, res) => {
  if (req.user.userType !== "EX20AF")
    return res.status(400).json({ msg: "invalid login" });
  res.json({ code: 200, auth: true });
};
const authPagePartner = (req, res) => {
  if (req.user.userType !== "EX50AF")
    return res.status(400).json({ msg: "invalid login" });
  res.json({ code: 200, auth: true });
};
const authPageSpringBoard = (req, res) => {
  if (req.user.userType !== "EXSBAF")
    return res.status(400).json({ msg: "invalid login" });
  res.json({ code: 200, auth: true });
};

passport.use(
  new PassportJWT.Strategy(
    {
      jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      algorithms: [jwtAlgorithm],
    },
    (payload, done) => {
      User.findById(payload.sub)
        .then((user) => {
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch((error) => {
          done(error, false);
        });
    }
  )
);

module.exports = {
  initialize: passport.initialize(),
  signUp,
  signUpAffiliates,
  verifyAffiliateToken,
  signUpPartner,
  signUpRefCode,
  setUpSpringBoard,
  signIn: passport.authenticate("local", { session: false }),
  requireJWT: passport.authenticate("jwt", { session: false }),
  signJWTForUser,
  signJWTForAffiliates,
  signJWTForPartners,
  signJWTForSpringBoard,
  authPageAffiliate,
  authPageMerchant,
  authPagePartner,
  authPageSpringBoard,
};
