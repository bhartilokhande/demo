const UserModel = require("../model/user");
const validation = require("../helper/validation");
const jwt = require("jsonwebtoken");
const { sign } = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const saltRounds = 5;
const sgMail = require("@sendgrid/mail");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 
const authController = {
  signup: async (req,res) => {
    try {
      let valiResponse = validation(
        ["email", "password", "name", "designation", "role"],
        req.body
      );
      if (valiResponse && valiResponse.errorExist) {
        return res.json({ statusCode: 400, statusMsg: valiResponse.error });
      }

      const data = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        designation: req.body.designation,
        role: req.body.role,
      };

      const isUserExist = await UserModel.findOne({ email: data.email });
      
      if (isUserExist) {
        return res.json({ statusCode: 400, statusMsg: "user already exist" });
      } else {
        let bcryptPassword = await bcrypt.hash(data.password, saltRounds);
        let param = {
          email: data.email,
          password: bcryptPassword,
          name: data.name,
          designation: data.designation,
          role: data.role,
        };
        const userData = new UserModel(param);
        const result = await userData.save();
        if (result) {
          return res.json({
            statusCode: 200,
            statusMsg: "user register successfully",
          });
        }
      }
    } catch (error) {
      return res.json({ statusCode: 400, error: error });
    }
  },

  login: async (req, res) => {
    try {
      let valiResponse = validation(
        ["email", "password"],
        req.body
      );
      if (valiResponse && valiResponse.errorExist) {
        return res.json({ statusCode: 400, statusMsg: valiResponse.error });
      }

      const data = {
        email: req.body.email,
        password: req.body.password,
      };

      const _existUser = await UserModel.findOne({ email: data.email });
      if (_existUser) {
        const _checkPassword = await bcrypt.compare(
          data.password,
          _existUser.password
        );
        if (!_checkPassword) {
          return res.json({ statusCode: 400, statusMsg: "Incorrect password" });
        } else {
          const accessToken = sign({ result: _existUser._id }, "User", {
            expiresIn: 200000,
          });

          return res.json({
            statusCode: 200,
            statusMsg: "Login successfully",
            data: {
              _id: _existUser.id,
              profilePic:_existUser.profilePic,
              name: _existUser.name,
              email: _existUser.email,
              designation: _existUser.designation,
              role: _existUser.role,
              token: accessToken,
            },
          });
        }
      } else {
        return res.json({ statusCode: 400, statusMsg: "user not register" });
      }
    } catch (error) {
      return res.json({ Error: error });
    }
  },

  forgotPassword: async (req, res) => {
    const email = req.body.email;
    let valiResponse = validation(["email"], req.body);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    const _isUserExist = await UserModel.findOne({ email: email });
    if (!_isUserExist) {
      return res.json({ statusCode: 400, statusMsg: "User not register" });
    } else {
      const secret = JWT_SECRET + _isUserExist.password;
      const accessToken = sign({ result: _isUserExist._id }, secret, {
        expiresIn: "15m",
      });

    
      const link = `http://localhost:3000/reset_password?email=${_isUserExist.email}&token=${accessToken}`;
      const msg = {
        to: email,
        from: "bharti.lokhande@thoughtwin.com",
        subject: "Reset Password Notification!",
        text: "and easy to do anywhere, even with Node.js",
        html: `<a href=${link}>Reset password link</a>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          return res.json({
            statusCode: 200,
            statusMsg:
              "You will receive an email with instructions on how to reset your password in a few minutes.",
          });
        })
        .catch((error) => {
          return res.json({ statusCode: 400, error: error });
        });
    }
  },

  resetPassword: async (req, res) => {
    let valiResponse = validation(
      ["newPassword", "confirmPassword", "email", "token"],
      req.body
    );
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    const { newPassword, confirmPassword, email, token } = req.body;
  
    if (newPassword !== confirmPassword) {
      return res.json({ statusCode: 400, statusMsg: "mismatch password" });
    }
  
    const _existUser = await UserModel.findOne({ email: email });
    if (!_existUser) {
      return res.json({ statusCode: 400, statusMsg: "Invalid user" });
    } else {
      try {
        const secret = JWT_SECRET + _existUser.password;
        const decoded = jwt.verify(token, secret);

        let bcryptPassword = await bcrypt.hash(newPassword, saltRounds);
        const updateUser = await UserModel.findByIdAndUpdate(decoded.result, {
          password: bcryptPassword,
        });
        if (updateUser) {
          return res.json({
            statusCode: 200,
            statusMsg: "password update successfully",
          });
        }
      } catch (error) {
        return res.json({ statusCode: 400, statusMsg: "Invalid token" });
      }
    }
  },
};

module.exports = authController;
