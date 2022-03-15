const { Registration } = require("../models/userModel");
const userServices = require("../services/userServices");
const crypto = require("crypto-js");
var jwt = require("jsonwebtoken");
const { mail } = require("../helper/mailer");
const sendResponse = require("../helper/responseSender");

const login = async function (req, res) {
  console.log("postmethod login");
  console.log("req ", req.body);
  console.log("req ", req.session);
  let email = req.body.email;
  let password = req.body.password;

  // validations
  if (req.body.email == "" || req.body.password == "") {
    return sendResponse(res, {
      status: false,
      message: "Please fill all details!",
    });
  }

  try {
    let loginObj = await Registration.findOne({ email: email });
    if (loginObj) {
      let key = "rego-nft";
      let hashedPass = crypto.HmacSHA512(password, key);
      console.log("loginObj._id", loginObj._id.toString());
      if (hashedPass == loginObj.password) {
        // Create token
        const token = jwt.sign(
          { user_id: loginObj._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        let updatetoken = await userServices.updateJwtToken(
          loginObj._id,
          token
        );
        console.log("updatetoken", updatetoken);

        loginObj = await Registration.findOne({ email: email });

        // res.status(200).json(loginObj);
        return sendResponse(res, {
          status: true,
          data: loginObj,
          message: "Success",
        });
      } else {
        // req.flash('error', 'Please enter correct password.');
        console.log("Please enter correct password.");
        return sendResponse(res, {
          status: false,
          message: "Please enter correct password.",
        });
      }
    } else {
      // req.flash('error', 'Please enter correct emailID.');
      console.log("Please enter correct emailID");
      return sendResponse(res, {
        status: false,
        message: "Please enter correct emailID",
      });
    }
  } catch (err) {
    return sendResponse(res, {
      status: false,
      message: "Something went wrong",
    });
  }
};

const forgetPassword = async (req, res) => {
  let email = req.body.email;
  email = email.toLowerCase();

  // validations
  if (req.body.email == "") {
    return sendResponse(res, {
      status: false,
      message: "Please fill all details!",
    });
  }

  user = await Registration.findOne({ email: req.body.email });
  if (user) {
    let user1 = await userServices.generateOtpForForgetPass(req.body.email);
    if (user1.otp) {
      console.log("otp sent to your email id");
      return sendResponse(res, {
        status: true,
        data: user1,
        message: "otp sent to your email id",
      });
    } else {
      return sendResponse(res, {
        status: false,
        message: "forget otp not sent",
      });
    }
  } else {
    return sendResponse(res, { status: false, message: "User does not exist" });
  }
};

const verifyotp = async function (req, res) {
  console.log("post method getverifyotp");
  console.log(req.body);

  // validations
  if (req.body.email == "" || req.body.otp == "") {
    return sendResponse(res, 400, {
      status: false,
      message: "Please fill all details!",
    });
  }

  let otp = req.body.otp;
  let user = await Registration.findOne({ email: req.body.email });

  if (user == null || user == undefined || user == "") {
    return sendResponse(res, 400, { status: false, message: "Invalid user" });
  }

  if (user.otp == otp) {
    console.log("otp matched successfully");
    return sendResponse(res, 200, {
      status: true,
      data: user,
      message: "otp matched successfully",
    });
  } else {
    return sendResponse(res, 400, { status: false, message: "incorrect otp" });
  }
  // res.render('forget-password');
};

const changepassword = async function (req, res) {
  console.log("post method changepassword");
  console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;

  // validations
  if (req.body.email == "" || req.body.password == "") {
    return sendResponse(res, {
      status: false,
      message: "Please fill all details!",
    });
  }

  let user = await Registration.findOne({ email: email });

  if (user == null || user == undefined || user == "") {
    return sendResponse(res, { status: false, message: "Invalid user" });
  }

  let key = "rego-nft";
  let hashedPass = crypto.HmacSHA512(password, key);
  hashedPass = hashedPass.toString();
  console.log(hashedPass);

  let user1 = await userServices.changePassword(email, hashedPass);
  if (user1) {
    console.log("password changed successfulyy");
    return sendResponse(res, {
      status: true,
      message: "password changed successfulyy",
    });
  } else {
    console.log("forget otp not sent");
    return sendResponse(res, { status: false, message: "forget otp not sent" });
  }
};

module.exports = {
  login,

  forgetPassword,
  verifyotp,
  changepassword,
};
