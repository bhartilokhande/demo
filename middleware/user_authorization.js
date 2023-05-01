const jwt = require("jsonwebtoken");

module.exports = async function checkToken(req, res, next) {
  const token = req.header("authorization");
  if (!token)
    return res.json({
      statusCode: 401,
      statusMsg: "Access denied. No token provided",
    });
  try {
    const decoded = jwt.verify(token, "User");
    req.user = decoded.result;
    next();
  } catch (error) {
    console.log("error", error);
    res.json({
      statusCode: 401,
      statusMsg: "Access denied. Invalid token provided",
    });
  }
};
