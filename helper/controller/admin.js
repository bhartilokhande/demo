const ProjectModel = require("../model/project");
const UserModel = require("../model/user");
const LeaveModel = require('../model/leave')
const validation = require("../helper/validation");
const bcrypt = require("bcrypt");
const saltRounds = 5;

const adminController = {
  addEmployee: async (req, res) => {
    let valiResponse = validation(
      ["email", "password", "name", "designation", "role"],
      req.body
    );
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    try {
      const data = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        designation: req.body.designation,
        role: req.body.role,
        user: req.user,
      };

      const isUserexist = await UserModel.findOne({ email: data.email });
      if (isUserexist) {
        return res.json({ statusCode: 400, statusMsg: "user already exist" });
      }

      let bcryptPassword = await bcrypt.hash(data.password, saltRounds);
      let param = {
        email: data.email,
        password: bcryptPassword,
        encryptPassword: data.password,
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
    } catch (error) {
      return res.json({ statusCode: 400, error: error });
    }
  },

  updateEmployee: async (req, res) => {
    let valiResponse = validation(
      ["email", "password", "name", "designation", "role"],
      req.body
    );
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    let userIdValidation = validation(["user_id"], req.query);
    if (userIdValidation && userIdValidation.errorExist) {
      return res.json({ statusCode: 400, statusMsg: userIdValidation.error });
    }

    const data = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      designation: req.body.designation,
      role: req.body.role,
      userId: req.query.user_id,
    };
    let bcryptPassword = await bcrypt.hash(data.password, saltRounds);
    const updateUser = await UserModel.findByIdAndUpdate(
      data.userId,
      {
        email: data.email,
        name: data.name,
        designation: data.designation,
        role: data.role,
        password: bcryptPassword,
        encryptPassword: data.password,
      },
      { returnOriginal: false }
    );

    if (updateUser) {
      return res.json({
        statusCode: 200,
        statusMsg: "updated successfully",
        data: updateUser,
      });
    } else {
      return res.json({ statusCode: 400, statusMsg: "not updated" });
    }
  },

  deleteEmployee: async (req, res) => {
    let valiResponse = validation(["user_id"], req.query);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    const user_id = req.query.user_id;
    const DeleteUser = await UserModel.findByIdAndDelete(user_id);
    if (DeleteUser) {
      return res.json({
        statusCode: 200,
        statusMsg: "User Deleted successfully",
      });
    } else {
      return res.json({ statusCode: 400, statusMsg: "User not exist " });
    }
  },

  addProject: async (req, res) => {
    let valiResponse = validation(["projectName"], req.body);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    const isProjectExist = await ProjectModel.findOne({
      projectName: req.body.projectName,
    });
    if (isProjectExist) {
      return res.json({ statusCode: 400, statusMsg: "Project allready added" });
    }
    const param = {
      projectName: req.body.projectName,
      project_member: req.body.project_member,
      status: req.body.status,
    };

    const projectData = new ProjectModel(param);
    const result = await projectData.save();
    if (result) {
      return res.json({
        statusCode: 200,
        statusMsg: "project added succssfully",
      });
    }
  },

  getProject: async (req, res) => {
    const projectName = req.query.project_name;
    const project_list = await ProjectModel.find({
      projectName: { $regex: projectName, $options: "$i" },
    }).populate("project_member", "name").sort({_id:-1});
    return res.json({ statusCode: 200, data: project_list });
  },

  deleteProject: async (req, res) => {
    let valiResponse = validation(["project_id"], req.query);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    const projectId = req.query.project_id;
    const deleteProject = await ProjectModel.findByIdAndDelete(projectId);
    if (deleteProject) {
      return res.json({
        statusCode: 200,
        statusMsg: "project deleted successfully",
      });
    } else {
      return res.json({ statusCode: 400, statusMsg: "Invalid projectId" });
    }
  },

  updateProject: async (req, res) => {
    const { projectName, projectMember } = req.body;
    const projectId = req.query.project_id;
    let valiResponse = validation(["project_id"], req.query);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    const updateProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      {
        projectName: projectName,
        project_member: projectMember,
      },
      { returnOriginal: false }
    );
    if (updateProject) {
      return res.json({
        statusCode: 200,
        statusMsg: "project updated successfully",
        data: updateProject,
      });
    } else {
      return res.json({ statusCode: 400, statusMsg: "not updated" });
    }
  },

  leaveList:async(req,res) => {
       const _status = req.query
       let query = {}
       if(_status.leaveStatus){
        query = {status:_status.leaveStatus}
       }

        const result = await LeaveModel.find(query).populate("user","name").sort({_id:-1});
        if(result){
          return res.json({statusCode:200,data:result})
        }
  },

  updateLeaveStatus:async(req,res) => {
    let valiResponse = validation(["LeaveId","leaveStatus"], req.query);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    const updateLeave = await LeaveModel.findByIdAndUpdate(req.query.LeaveId,{"status":req.query.leaveStatus})
    if(updateLeave) {
      return res.json({statusCode:200,statusMsg:`Leave ${req.query.leaveStatus}`})
    }else{
      return res.json({statusCode:400,statusMsg:`Invalid user`})
    }

  }
};

module.exports = adminController;



