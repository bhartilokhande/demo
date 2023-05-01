const ProjectModel = require("../model/project");
const LeaveModel = require("../model/leave");
const validation = require("../helper/validation");

const user = {
  getProject: async (req, res) => {
    const data = req.query.userId;
    const result = await ProjectModel.find({
      project_member: { $in: data },
    }).populate("project_member", "name");

    return res.json({ statusCode: 200, data: result });
  },

  applyLeave: async (req, res) => {
    const user = req.query.userId;

    let _valiResponse = validation(["userId"], req.query);
    if (_valiResponse && _valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: _valiResponse.error });
    }

    let valiResponse = validation(
      ["startDate", "endDate", "Leavetype", "period", "reason"],
      req.body
    );

    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }

    try {
      const param = {
        user: user,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        Leavetype: req.body.Leavetype,
        period: req.body.period,
        reason: req.body.reason,
      };

      const leaveData = new LeaveModel(param);
      const result = await leaveData.save();

      if (result) {
        return res.json({
          statusCode: 200,
          statusMsg: "leave successfully apply",
        });
      }
    } catch (error) {
      return res.json({
        statusCode: 400,
        error: error,
      });
    }
  },

  getLeaveList: async (req, res) => {
    const userId = req.query.userId;
    let valiResponse = validation(["userId"], req.query);
    if (valiResponse && valiResponse.errorExist) {
      return res.json({ statusCode: 400, statusMsg: valiResponse.error });
    }
    try {
      const leaveList = await LeaveModel.find({ user: userId }).populate(
        "user",
        "name"
      ).sort({_id:-1});
      if (leaveList) {
        return res.json({ statusCode: 200, data: leaveList });
      } else {
        return res.json({ statusCode: 400, statusMsg: "Invalid user" });
      }
    } catch (error) {
      return res.json({ statusCode: 400, error: error });
    }
  },

 
};

module.exports = user;
