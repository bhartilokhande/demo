const UserModal = require("../model/user");
const ProjectModel = require("../model/project");
const validation = require("../helper/validation");
const fs = require("fs");
const crypto = require("crypto");

const commonController = {
  getAllEmployee: async (req, res) => {
    const user_name = req.query.user_name;
    const login_user = req.query.login_user_id;
    const pages = req.query.pages;
    const email = req.query.email;
    const designation = req.query.designation;
    const role = req.query.role;

    let query = {};
    let filterQuery = {};

    // validation for login user id
    let valiResponse = validation(["login_user_id"], req.query);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    // check user role
    const userRole = await UserModal.findById(login_user);
    if (userRole.role == 1 || userRole.role == 2) {
      query = {};
    } else {
      query = { password: 0, role: 0, encryptPassword: 0 };
    }

    // filter by username
    if (user_name) {
      filterQuery = {
        _id: { $ne: login_user },
        name: { $regex: user_name, $options: "$i" },
      };
    }

    // filter by email
    if (email) {
      filterQuery = {
        _id: { $ne: login_user },
        email: email,
      };
    }

    // filter by Designation
    if (designation) {
      filterQuery = {
        _id: { $ne: login_user },
        designation: designation,
      };
    }

    // filter by Role
    if (role) {
      filterQuery = {
        _id: { $ne: login_user },
        role: role,
      };
    }

    // query for get all user
    const list = await UserModal.find(filterQuery, query)
      .limit(pages ? pages : "")
      .sort({ _id: -1 });
    return res.json({ statusMsg: 200, data: list });
  },

  getEmployee: async (req, res) => {
    const user_id = req.query.user_id;
    const login_user = req.query.login_user_id;
    let query = {};

    let valiResponse = validation(["login_user_id"], req.query);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    // check user role
    const userRole = await UserModal.findById(login_user);
    if (userRole.role == 1 || userRole.role == 2) {
      query = {};
    } else {
      query = { password: 0, role: 0, encryptPassword: 0 };
    }

    // query for get user
    const user = await UserModal.findById(user_id, query);
    return res.json({ statuCode: 200, User: user });
  },

  getProject: async (req, res) => {
    let valiResponse = validation(["project_id"], req.query);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    const projectId = req.query.project_id;

    // query for get user
    const project = await ProjectModel.findById(projectId).populate(
      "project_member",
      "name"
    );
    if (project) {
      return res.json({ statuCode: 200, Project_details: project });
    } else {
      return res.json({
        statuCode: 400,
        Project_details: "Invalid project id",
      });
    }
  },

  getHash: async (req, res) => {
    const demo = req.file
    const fileBuffer = fs.readFileSync(demo.path);
    const hash = crypto.createHash("sha256");
    const finalHex = hash.update(fileBuffer).digest("hex");
    return res.send(finalHex)
  
  },
};

module.exports = commonController;
